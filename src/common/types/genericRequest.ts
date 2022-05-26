import { Role } from '../../modules/profile/constants/role'
import { Request } from 'express'

export type GenericRequest = Request & {
  user: {
    userId: string
    email: string
    roles: Role[]
  }
}
