import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

const typeOrmProvider = TypeOrmModule.forRoot()

@Module({
  imports: [typeOrmProvider],
  exports: [typeOrmProvider],
})
export class DatabaseModule {}
