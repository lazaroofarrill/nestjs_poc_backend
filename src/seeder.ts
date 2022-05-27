import { createConnection } from 'typeorm'
import axios from 'axios'
import { randomInt } from 'crypto'
import { randomUserToProfile } from '../test/utils/random-user-to-profile'
import { Profile } from './modules/profile/entities/profile.entity'

const args = process.argv.slice(2)
const profilesTotal = Number.parseInt(
  args.find((a) => a.includes('--profilesTotal'))?.split('=')[1],
)
if (isNaN(profilesTotal)) {
  throw Error('profilesTotal must be an integer number')
}

const friendsTotal = Number.parseInt(
  args.find((a) => a.includes('--friendsTotal'))?.split('=')[1],
)
if (isNaN(friendsTotal)) {
  throw Error('friendsTotal must be an integer number')
}

if (friendsTotal > profilesTotal * (profilesTotal - 1)) {
  throw Error(
    "It's impossible to build a graph with the supplied values friendsTotal can't be greater than profilesTotal*(profilesTotal-1)",
  )
}

async function seed() {
  const connection = await createConnection()
  const {
    data: { results: users },
  } = await axios.get(`https://randomuser.me/api/?results=${profilesTotal}`)
  const newProfiles = users.map((u) => randomUserToProfile(u))

  connection.manager
    .transaction(async (manager) => {
      const profileRepo = manager.getRepository(Profile)

      const createdProfiles = await profileRepo.save(newProfiles)
      const possibleFriendships = []
      for (let i = 0; i < profilesTotal; i++) {
        for (let j = i + 1; j < profilesTotal; j++) {
          possibleFriendships.push([i, j])
          possibleFriendships.push([j, i])
        }
      }
      const friendShips = []
      for (let i = 0; i < friendsTotal; i++) {
        if (possibleFriendships.length === 1) {
          friendShips.push(possibleFriendships[0])
          possibleFriendships.shift()
        } else {
          const select = randomInt(0, possibleFriendships.length - 1)
          friendShips.push(possibleFriendships[select])
          possibleFriendships.splice(select, 1)
        }
      }

      await manager.query(
        `INSERT INTO profile_friends_profile (profile_id_1, profile_id_2)
         VALUES ${friendShips
           .map((f) => {
             try {
               return `('${createdProfiles[f[0]].id}', '${
                 createdProfiles[f[1]].id
               }')`
             } catch (e) {
               console.log(f)
               throw Error(e)
             }
           })
           .join(',')}`,
      )
    })
    .then(() => {
      console.log('database seeded successfully')
      process.exit()
    })
}

seed()
