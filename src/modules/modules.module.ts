import { Module, ValidationPipe } from '@nestjs/common'
import { ProfileModule } from './profile/profile.module'
import { AuthModule } from './auth/auth.module'
import { APP_PIPE } from '@nestjs/core'

@Module({
  imports: [ProfileModule, AuthModule],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          transform: true,
        })
      },
    },
  ],
})
export class ModulesModule {}
