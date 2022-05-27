import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { HashPasswordPipe } from '../../common/pipes/hash-password.pipe'
import { CreateProfileDto } from '../profile/dto/create-profile.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { Public } from './decorators/public.decorator'
import { FilterRolePipe } from '../../common/pipes/filter-role.pipe'
import { ApiBody, ApiOperation } from '@nestjs/swagger'
import { LoginPayload } from './types/loginPayload'

@Controller('auth')
export class AuthController {
  constructor(readonly service: AuthService) {}

  @Public()
  @Post('/sign-up')
  @ApiOperation({ summary: 'Create new user.' })
  async signUp(
    @Body(FilterRolePipe, HashPasswordPipe)
    createProfileDto: CreateProfileDto,
  ) {
    return this.service.signUp(createProfileDto)
  }

  @Public()
  @ApiOperation({ summary: 'Authenticate user.' })
  @ApiBody({ type: LoginPayload })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req) {
    return this.service.login(req.user)
  }
}
