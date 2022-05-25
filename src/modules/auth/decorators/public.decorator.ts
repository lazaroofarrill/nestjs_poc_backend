import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_DECORATED = 'isPublicDecorated'

export const Public = (...args: string[]) =>
  SetMetadata(IS_PUBLIC_DECORATED, args)
