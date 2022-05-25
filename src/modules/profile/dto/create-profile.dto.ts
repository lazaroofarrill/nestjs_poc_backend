import { DeepPartial } from 'typeorm'
import { Profile } from '../entities/profile.entity'

export class CreateProfileDto {
  img: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipcode: string
  available: boolean
  Friends: DeepPartial<Profile>[]
}
