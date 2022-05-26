import { DeepPartial } from 'typeorm'
import { Profile } from '../entities/profile.entity'
import {
  Allow,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator'
import { Role } from '../constants/role'

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

  @IsEnum(Role, { each: true })
  @IsOptional()
  roles: Role[]

  @Allow()
  Friends: DeepPartial<Profile>[]
}
