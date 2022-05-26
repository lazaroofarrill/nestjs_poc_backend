import { Injectable } from '@nestjs/common'
import { ProfileService } from '../profile/profile.service'
import { CreateProfileDto } from '../profile/dto/create-profile.dto'

@Injectable()
export class AuthService {
  constructor(readonly profileService: ProfileService) {}

  signUp(createProfileDto: CreateProfileDto) {}

  login() {}
}
