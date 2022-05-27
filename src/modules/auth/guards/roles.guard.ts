import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Role } from '../../profile/constants/role'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(...allowedRoles: Role[]) {
    this.allowedRoles = allowedRoles
  }

  private readonly allowedRoles

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userRoles = context.switchToHttp().getRequest().user.roles as Role[]
    for (const r of this.allowedRoles) {
      if (userRoles.includes(r)) return true
    }

    throw new ForbiddenException(
      `Only users with ${this.allowedRoles} roles are allowed`,
    )
  }
}
