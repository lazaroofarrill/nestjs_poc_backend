import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ProfileRepository } from './repos/profile.repository'
import { Profile } from './entities/profile.entity'

@Injectable()
export class ProfileService {
  constructor(private readonly repo: ProfileRepository) {}

  create(createProfileDto: CreateProfileDto) {
    return this.repo.save(createProfileDto)
  }

  findAll() {
    return this.repo.find()
  }

  async findOne(id: string) {
    const profile = await this.repo.findOne({ id })
    if (!profile) {
      throw new NotFoundException('Profile not found')
    }
    return profile
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const existing = await this.findOne(id)
    if (!existing) {
      throw new NotFoundException('User not found')
    }
    return await this.repo.save(
      Object.assign({}, existing, updateProfileDto, { id: id }),
    )
  }

  async remove(id: string) {
    const existing = await this.findOne(id)
    if (!existing) {
      throw new NotFoundException('User not found')
    }
    return await this.repo.softRemove({
      id: id,
    })
  }

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

  async addFriend(id1: string, id2: string) {
    const friendList = await this.getFriends(id1)
    if (friendList.map((f) => f.id).includes(id2)) {
      throw new BadRequestException('friendship exists already.')
    }
    const newFriend = await this.findOne(id2)
    return this.update(id1, { Friends: friendList.concat(newFriend) })
  }

  async mutualFriendShip(id1: string, id2: string) {
    return Promise.all([this.addFriend(id1, id2), this.addFriend(id2, id1)])
  }

  async getPath(start: string, end: string): Promise<string[] | boolean> {
    const visited = [start]
    const gf = this.getFriends
    const traversed = await friendsTraverse(start, end, [start])
    if (traversed === false) throw new NotFoundException('No relation found')
    return traversed

    async function friendsTraverse(
      root: string,
      goal: string,
      path: string[] = [],
    ) {
      const friends = (await gf(root))
        .map((f) => f.id)
        .filter((id) => !visited.includes(id))
      for (const friend of friends) {
        const currPath = path.concat(friend)
        if (friend === goal) return currPath
        const traversal = await friendsTraverse(friend, goal, currPath)
        if (traversal !== false) {
          return traversal
        }
      }
      return false
    }
  }
}
