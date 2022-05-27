import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { HashPasswordPipe } from '../../common/pipes/hash-password.pipe'
import { CreateProfileDto } from '../profile/dto/create-profile.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { Public } from './decorators/public.decorator'
import { ValidateRolePipe } from '../../common/pipes/validate-role.pipe'

@Controller('auth')
export class AuthController {
  constructor(readonly service: AuthService) {}

  @Public()
  @Post('/sign-up')
  async signUp(
    @Body(ValidateRolePipe, HashPasswordPipe)
    createProfileDto: CreateProfileDto,
  ) {
    return this.service.signUp(createProfileDto)
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req) {
    return this.service.login(req.user)
  }
}
