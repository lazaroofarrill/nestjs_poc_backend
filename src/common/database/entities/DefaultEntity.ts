import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ApiHideProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

export class DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Exclude()
  @ApiHideProperty()
  @DeleteDateColumn()
  deletedAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
