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

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(new RolesGuard(Role.ADMIN))
  async create(
    @Body(HashPasswordPipe) createProfileDto: CreateProfileDto,
    @Req() req: GenericRequest,
  ) {
    const user = await this.profileService.findOne(req.user.userId)
    if (
      createProfileDto.roles.includes(Role.ADMIN) &&
      !user.roles.includes(Role.ADMIN)
    ) {
      throw new ForbiddenException('This user is not allowed to create admins')
    }
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
  findAllFriends(@Param('id') id: string, @Req() req: GenericRequest) {
    if (req.user.userId) {
    }

    return this.profileService.getFriends(id)
  }

  @Get('distance/:start/:end')
  getPath(
    @Param('start', ParseUUIDPipe) start: string,
    @Param('end', ParseUUIDPipe) end: string,
  ) {
    return this.profileService.getPath(start, end)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id)
  }

  @Post(':id/friends/add/:newFriend')
  addFriend(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('newFriend') newFriend: string,
  ) {
    return this.profileService.addFriend(id, newFriend)
  }

  @Post('/friends/connect/:friend1/:friend2')
  addMutualFriendship(
    @Param('friend1', ParseUUIDPipe) friend1: string,
    @Param('friend2', ParseUUIDPipe) friend2: string,
  ) {
    return this.profileService.mutualFriendShip(friend1, friend2)
  }
}
