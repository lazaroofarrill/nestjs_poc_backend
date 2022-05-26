import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ProfileService } from '../profile/profile.service'
import { CreateProfileDto } from '../profile/dto/create-profile.dto'
import * as bcrypt from 'bcrypt'
import { Profile } from '../profile/entities/profile.entity'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {}

  signUp(createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto, req)
  }

  login(user: Profile) {
    const { email, id } = user
    const payload = {
      sub: id,
      email,
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
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
