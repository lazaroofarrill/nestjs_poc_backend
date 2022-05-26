import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ProfileRepository } from './repos/profile.repository'
import { Profile } from './entities/profile.entity'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { FindManyOptions } from 'typeorm'

@Injectable()
export class ProfileService {
  constructor(public readonly repo: ProfileRepository) {}

  @Transactional()
  create(createProfileDto: CreateProfileDto) {
    return this.repo.save(createProfileDto)
  }

  @Transactional()
  findAll(options?: FindManyOptions) {
    return this.repo.find(options)
  }

  @Transactional()
  async findOne(id: string) {
    const profile = await this.repo.findOne({ id })
    if (!profile) {
      throw new NotFoundException('Profile not found')
    }
    return profile
  }

  @Transactional()
  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const existing = await this.findOne(id)
    if (!existing) {
      throw new NotFoundException('User not found')
    }
    return await this.repo.save(
      Object.assign({}, existing, updateProfileDto, { id: id }),
    )
  }

  @Transactional()
  async remove(id: string) {
    const existing = await this.findOne(id)
    if (!existing) {
      throw new NotFoundException('User not found')
    }
    return await this.repo.softRemove({
      id: id,
    })
  }

  @Transactional()
  async getFriends(id: string): Promise<Profile[]> {
    const existing = await this.repo.findOne({
      where: {
        id: id,
      },
      relations: ['Friends'],
    })
    if (!existing) {
      throw new NotFoundException('User not found')
    }
    return existing.Friends
  }

  @Transactional()
  async addFriend(id1: string, id2: string) {
    const friendList = await this.getFriends(id1)
    if (friendList.map((f) => f.id).includes(id2)) {
      throw new BadRequestException('friendship exists already.')
    }
    const newFriend = await this.findOne(id2)
    return this.update(id1, { Friends: friendList.concat(newFriend) })
  }

  @Transactional()
  async mutualFriendShip(id1: string, id2: string) {
    return Promise.all([this.addFriend(id1, id2), this.addFriend(id2, id1)])
  }

  @Transactional()
  async getPath(start: string, end: string): Promise<string[] | boolean> {
    const traversed = await this.friendsTraverse(start, end, [start], [start])
    if (traversed === false) throw new NotFoundException('No relation found')
    return traversed
  }

  @Transactional()
  async friendsTraverse(
    root: string,
    goal: string,
    path: string[] = [],
    visited: string[],
  ) {
    const friends = (await this.getFriends(root))
      .map((f) => f.id)
      .filter((id) => !visited.includes(id))
    for (const friend of friends) {
      const currPath = path.concat(friend)
      if (friend === goal) return currPath
      const traversal = await this.friendsTraverse(
        friend,
        goal,
        currPath,
        visited,
      )
      if (traversal !== false) {
        return traversal
      }
    }
    return false
  }
}
