import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { CreateProfileDto } from '../../modules/profile/dto/create-profile.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  async transform(value: CreateProfileDto, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const { password } = value
      const salt = await bcrypt.genSalt()

      if (password) {
        value.password = await bcrypt.hash(password, salt)
      }
    }
    return value
  }
}
