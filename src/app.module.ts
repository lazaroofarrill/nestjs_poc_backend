import { Module } from '@nestjs/common'
import { ModulesModule } from './modules/modules.module'
import { CommonModule } from './common/common.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ModulesModule,
    CommonModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
