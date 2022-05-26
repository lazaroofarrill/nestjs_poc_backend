import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { HashPasswordPipe } from '../../common/pipes/hash-password.pipe'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body(HashPasswordPipe) createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto)
  }

  @Get()
  findAll() {
    return this.profileService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id)
  }

  @Get(':id/friends')
  findAllFriends(@Param('id') id: string) {
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
