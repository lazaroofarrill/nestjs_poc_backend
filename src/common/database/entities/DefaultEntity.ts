import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export class DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @DeleteDateColumn()
  deletedAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
