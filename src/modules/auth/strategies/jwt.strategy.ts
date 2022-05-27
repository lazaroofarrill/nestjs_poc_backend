import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ProfileService } from '../../profile/profile.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private profileService: ProfileService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: any) {
    try {
      const user = await this.profileService.findOne(payload.sub)
      return { userId: payload.sub, email: payload.email, roles: user.roles }
    } catch (e) {
      throw new UnauthorizedException({
        error: 'the user this token belongs to does not exist in the system',
        data: payload.sub,
      })
    }
  }
}
