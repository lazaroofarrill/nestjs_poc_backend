import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { HashPasswordPipe } from '../../common/pipes/hash-password.pipe'
import { CreateProfileDto } from '../profile/dto/create-profile.dto'

@Controller('auth')
export class AuthController {
  constructor(readonly service: AuthService) {}

  @Post('/sign-up')
  signUp(@Body(HashPasswordPipe) createProfileDto: CreateProfileDto) {
    return 'ok'
  }

  @Get('login')
  login() {}
}
