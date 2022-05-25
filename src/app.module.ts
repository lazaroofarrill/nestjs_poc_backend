import { Module } from '@nestjs/common'
import { ModulesModule } from './modules/modules.module'
import { CommonModule } from './common/common.module'
import { ConfigModule } from './config/config.module'

@Module({
  imports: [ModulesModule, CommonModule, ConfigModule],
})
export class AppModule {}
