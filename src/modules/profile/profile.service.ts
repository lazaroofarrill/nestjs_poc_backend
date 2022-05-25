import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { profilesDb } from './db/profilesDb'
import { friendsDb } from './db/friendsDb'
import { Profile } from './entities/profile.entity'

@Injectable()
export class ProfileService {
  create(createProfileDto: CreateProfileDto) {
    const id = profilesDb.length + 1
    return profilesDb.push(Object.assign(createProfileDto, { id }))
  }

  findAll() {
    return profilesDb
  }

  findOne(id: number) {
    return profilesDb.find((p) => p.id = id)
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    const eIdx = profilesDb.findIndex((p) => p.id = id)
    if (eIdx !== -1) {
      profilesDb[eIdx] = Object.assign({}, profilesDb[eIdx], updateProfileDto)
      return profilesDb[eIdx]
    }
    throw new NotFoundException()
  }

  remove(id: number) {
    const eIdx = profilesDb.findIndex((p) => p.id = id)
    if (eIdx !== -1) {
      return profilesDb.splice(eIdx, 1)

    }
    throw new NotFoundException()
  }

  getFriends(id: number): Profile[] {
    return friendsDb.filter((f) => f.f1_id === id)
      .map((f) => profilesDb.find((p) => p.id === f.f2_id))
  }

  addFriend(id1: number, id2: number) {
    const tuple = friendsDb.find(f => f.f1_id === id1 && f.f2_id === id2)
    if (!tuple) {
      friendsDb.push({
        f1_id: id1,
        f2_id: id2,
      })
      return true
    }
    throw new BadRequestException()
  }

  getPath(start: number, end: number) {
    const visited = [start]
    const gf = this.getFriends
    const traversed = friendsTraverse(start, end, [start])
    if (traversed === false) throw new NotFoundException('No relation found')
    return traversed

    function friendsTraverse(root: number, goal: number, path: number[] = []) {
      const friends = gf(root).map(f => f.id).filter(id => !visited.includes(id))
      for (const friend of friends) {
        const currPath = path.concat(friend)
        if (friend === goal) return currPath
        const traversal = friendsTraverse(friend, goal, currPath)
        if (traversal !== false) {
          return traversal
        }
      }

      return false
    }
  }
}
