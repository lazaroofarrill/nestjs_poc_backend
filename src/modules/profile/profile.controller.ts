import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { HashPasswordPipe } from '../../common/pipes/hash-password.pipe'
import { GenericRequest } from '../../common/types/genericRequest'
import { Role } from './constants/role'
import { RolesGuard } from '../auth/guards/roles.guard'
import { FilterRolePipe } from '../../common/pipes/filter-role.pipe'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import { Profile } from './entities/profile.entity'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiBody({ type: CreateProfileDto })
  @ApiOperation({
    summary:
      'Create a new profile in this endpoint. Only Admins are allowed here.',
  })
  @ApiBearerAuth()
  @UseGuards(new RolesGuard(Role.ADMIN))
  async create(
    @Body(FilterRolePipe, HashPasswordPipe)
    createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    return this.profileService.create(createProfileDto)
  }

  @Get()
  @ApiOperation({ summary: 'List all profiles. Only Admins allowed here' })
  @UseGuards(new RolesGuard(Role.ADMIN))
  findAll(): Promise<Profile[]> {
    return this.profileService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: "Get profile's info." })
  async findOne(@Param('id') id: string, @Req() req: GenericRequest) {
    if (
      req.user.roles.includes(Role.ADMIN) ||
      (await this.profileService.getFriends(req.user.userId))
    ) {
      return this.profileService.findOne(id)
    }
    throw new ForbiddenException("You don't have access to this information")
  }

  @Get(':id/friends')
  @ApiOperation({
    summary:
      "List a profile's friend. Regular user's can get at most friends of friends.",
  })
  async findAllFriends(@Param('id') id: string, @Req() req: GenericRequest) {
    if (
      req.user.roles.includes(Role.ADMIN) ||
      id === req.user.userId ||
      (await this.profileService.getFriends(req.user.userId))
        .map((f) => f.id)
        .includes(id)
    ) {
      return this.profileService.getFriends(id)
    }

    throw new ForbiddenException(
      "You can't list friends of people you are not friends with",
    )
  }

  @ApiOperation({
    summary: 'Find friendship path between two users. Admins only.',
  })
  @Get('distance/:start/:end')
  @UseGuards(new RolesGuard(Role.ADMIN))
  getPath(
    @Param('start', ParseUUIDPipe) start: string,
    @Param('end', ParseUUIDPipe) end: string,
  ) {
    return this.profileService.getPath(start, end)
  }

  @Patch(':id')
  @ApiBody({ type: CreateProfileDto })
  @ApiOperation({ summary: "Edit profile's info" })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'User not logged in' })
  @ApiResponse({
    status: 403,
    description: "User not authorized to edit this profile's information",
  })
  update(
    @Param('id') id: string,
    @Body(FilterRolePipe, HashPasswordPipe)
    updateProfileDto: UpdateProfileDto,
    @Req() req: GenericRequest,
  ) {
    if (req.user.roles.includes(Role.ADMIN) || id === req.user.userId) {
      return this.profileService.update(id, updateProfileDto)
    }
    throw new ForbiddenException("You cannot update this profile's information")
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete profile' })
  remove(@Param('id') id: string, @Req() req: GenericRequest) {
    if (req.user.roles.includes(Role.ADMIN) || id === req.user.userId) {
      return this.profileService.remove(id)
    }
    throw new ForbiddenException('You cannot delete this profile')
  }

  @ApiOperation({ summary: 'Add friend to user.' })
  @Get(':id/friends/add/:newFriend')
  addFriend(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('newFriend') newFriend: string,
    @Req() req: GenericRequest,
  ) {
    if (req.user.roles.includes(Role.ADMIN) || id === req.user.userId) {
      return this.profileService.addFriend(id, newFriend)
    }
    throw new ForbiddenException("You can't add friends to other profiles")
  }

  @Get('/friends/connect/:friend1/:friend2')
  @ApiOperation({ summary: 'Connect two users. Admins only.' })
  @UseGuards(new RolesGuard(Role.ADMIN))
  addMutualFriendship(
    @Param('friend1', ParseUUIDPipe) friend1: string,
    @Param('friend2', ParseUUIDPipe) friend2: string,
  ) {
    return this.profileService.mutualFriendShip(friend1, friend2)
  }
}
