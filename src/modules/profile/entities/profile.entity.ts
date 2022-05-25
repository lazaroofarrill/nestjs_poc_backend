import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { DefaultEntity } from '../../../common/database/entities/DefaultEntity'

@Entity()
export class Profile extends DefaultEntity {
  @Column()
  img: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  phone: string

  @Column()
  address: string

  @Column()
  city: string

  @Column()
  state: string

  @Column()
  zipcode: string

  @Column()
  available: boolean

  @ManyToMany(() => Profile)
  @JoinTable()
  Friends: Profile[]
}
