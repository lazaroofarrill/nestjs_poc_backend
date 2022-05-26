import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ProfileModule } from '../profile/profile.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ProfileModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
