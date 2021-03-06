import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { ProfileModule } from './profile/profile.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { JwtGuard } from './auth/guards/jwt.guard'

@Module({
  imports: [ProfileModule, AuthModule],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          transform: true,
          whitelist: true,
        })
      },
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class ModulesModule {}
