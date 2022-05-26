import { DeepPartial } from 'typeorm'
import { Profile } from '../entities/profile.entity'
import { IsBoolean, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class CreateProfileDto implements DeepPartial<Profile> {
  @IsString()
  email: string

  @IsString()
  password: string

  @IsString()
  img: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsPhoneNumber()
  @IsOptional()
  phone: string

  @IsString()
  address: string

  @IsString()
  city: string

  @IsString()
  state: string

  @IsString()
  zipcode: string

  @IsBoolean()
  @IsOptional()
  available: boolean

  Friends: DeepPartial<Profile>[]
}
