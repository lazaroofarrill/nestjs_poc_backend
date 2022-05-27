import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ModulesModule } from './modules/modules.module'
import { CommonModule } from './common/common.module'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [
    ModulesModule,
    CommonModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
