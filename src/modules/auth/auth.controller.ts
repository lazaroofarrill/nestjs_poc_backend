import { Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(readonly service: AuthService) {}

  @Post('/sign-up')
  signUp() {}

  @Get('login')
  login() {}
}
