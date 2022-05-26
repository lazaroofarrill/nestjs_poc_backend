import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ProfileService } from '../profile/profile.service'
import { CreateProfileDto } from '../profile/dto/create-profile.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly profileService: ProfileService) {}

  signUp(createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto)
  }

  login(userId: string) {
    return this.profileService.findOne(userId)
  }

  async checkUser(username: string, password: string) {
    const user = await this.profileService.repo.findOne({
      where: { email: username },
    })

    if (!user) throw new UnauthorizedException('User does not exist')
    const checks = await bcrypt.compare(password, user.password)
    if (checks) return user
    return null
  }
}
