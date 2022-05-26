import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [DatabaseModule],
})
export class CommonModule {}
