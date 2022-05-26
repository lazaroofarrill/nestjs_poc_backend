import { Module } from '@nestjs/common'
import { ModulesModule } from './modules/modules.module'
import { CommonModule } from './common/common.module'

@Module({
  imports: [ModulesModule, CommonModule],
})
export class AppModule {}
