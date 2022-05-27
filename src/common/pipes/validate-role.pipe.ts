import {
  ArgumentMetadata,
  ForbiddenException,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { GenericRequest } from '../types/genericRequest'
import { Role } from '../../modules/profile/constants/role'
import { ProfileService } from '../../modules/profile/profile.service'
import { UpdateProfileDto } from '../../modules/profile/dto/update-profile.dto'

@Injectable()
export class ValidateRolePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private req: GenericRequest,
    private profileService: ProfileService,
  ) {}

  async transform(value: UpdateProfileDto, metadata: ArgumentMetadata) {
    const user = await this.profileService.findOne(this.req.user.userId)
    if (value?.roles.includes(Role.ADMIN) && !user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException('This user is not allowed to create admins')
    }
    return value
  }
}
