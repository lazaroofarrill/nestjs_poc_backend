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
import { ValidateRolePipe } from '../../common/pipes/validate-role.pipe'
import { Hash } from 'crypto'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(new RolesGuard(Role.ADMIN))
  async create(
    @Body(ValidateRolePipe, HashPasswordPipe)
    createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.create(createProfileDto)
  }

  @Get()
  @UseGuards(new RolesGuard(Role.ADMIN))
  findAll() {
    return this.profileService.findAll()
  }

  @Get(':id')
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
  async findAllFriends(@Param('id') id: string, @Req() req: GenericRequest) {
    if (
      req.user.roles.includes(Role.ADMIN) ||
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

  @Get('distance/:start/:end')
  @UseGuards(new RolesGuard(Role.ADMIN))
  getPath(
    @Param('start', ParseUUIDPipe) start: string,
    @Param('end', ParseUUIDPipe) end: string,
  ) {
    return this.profileService.getPath(start, end)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidateRolePipe, HashPasswordPipe)
    updateProfileDto: UpdateProfileDto,
    @Req() req: GenericRequest,
  ) {
    if (req.user.roles.includes(Role.ADMIN) || id === req.user.userId) {
      return this.profileService.update(id, updateProfileDto)
    }
    throw new ForbiddenException("You cannot update this profile's information")
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: GenericRequest) {
    if (req.user.roles.includes(Role.ADMIN) || id === req.user.userId) {
      return this.profileService.remove(id)
    }
    throw new ForbiddenException('You cannot delete this profile')
  }

  @Post(':id/friends/add/:newFriend')
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

  @Post('/friends/connect/:friend1/:friend2')
  @UseGuards(new RolesGuard(Role.ADMIN))
  addMutualFriendship(
    @Param('friend1', ParseUUIDPipe) friend1: string,
    @Param('friend2', ParseUUIDPipe) friend2: string,
  ) {
    return this.profileService.mutualFriendShip(friend1, friend2)
  }
}
