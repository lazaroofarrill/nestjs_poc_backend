import { Module } from '@nestjs/common'
import { ProfileModule } from './profile/profile.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [ProfileModule, AuthModule],
})
export class ModulesModule {}
