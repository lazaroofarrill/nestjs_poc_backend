import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm'
import { DefaultEntity } from '../../../common/database/entities/DefaultEntity'
import { Role } from '../constants/role'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { RelationDto } from '../../../common/dtos/relation-dto'
import { Exclude } from 'class-transformer'

@Entity()
@Index(['email'], { where: 'deleted_at is null', unique: true })
export class Profile extends DefaultEntity {
  @Column()
  email: string

  @Exclude()
  @ApiHideProperty()
  @Column()
  password: string

  @ApiProperty({ format: 'uri' })
  @Column({ nullable: true })
  img: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ nullable: true })
  phone: string

  @Column()
  address: string

  @Column()
  city: string

  @Column()
  state: string

  @Column()
  zipcode: string

  @Column({ default: true })
  available: boolean

  @ApiProperty({
    type: RelationDto,
    isArray: true,
    description: "This user's friend list",
  })
  @ManyToMany(() => Profile)
  @JoinTable()
  Friends?: Profile[]

  @Column('enum', { array: true, enum: Role, default: [Role.USER] })
  roles?: Role[]
}
