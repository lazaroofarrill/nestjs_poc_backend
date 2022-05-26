import { EntityRepository } from 'typeorm'
import { Profile } from '../entities/profile.entity'
import { BaseRepository } from 'typeorm-transactional-cls-hooked'

@EntityRepository(Profile)
export class ProfileRepository extends BaseRepository<Profile> {}
