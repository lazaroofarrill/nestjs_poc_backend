import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm'
import { DefaultEntity } from '../../../common/database/entities/DefaultEntity'
import { Role } from '../constants/role'

@Entity()
@Index(['email'], { where: 'deleted_at is null', unique: true })
export class Profile extends DefaultEntity {
  @Column()
  email: string

  @Column()
  password: string

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

  @ManyToMany(() => Profile)
  @JoinTable()
  Friends?: Profile[]

  @Column('enum', { array: true, enum: Role, default: [Role.USER] })
  roles?: Role[]
}
