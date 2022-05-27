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
  throw Error("It's impossible to build a graph with the supplied values")
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
      const friendShips = []
      for (let i = 0; i < friendsTotal; i++) {
        const newFriendsShip = [
          randomInt(0, createdProfiles.length - 1),
          randomInt(0, createdProfiles.length - 1),
        ]
        if (
          newFriendsShip[0] === newFriendsShip[1] ||
          friendShips.find(
            (fsp) =>
              fsp[0] === newFriendsShip[0] && fsp[1] === newFriendsShip[1],
          ) !== undefined
        ) {
          i--
        } else {
          friendShips.push(newFriendsShip)
        }
      }

      await manager.query(
        `INSERT INTO profile_friends_profile (profile_id_1, profile_id_2)
         VALUES ${friendShips
           .map(
             (f) =>
               `('${createdProfiles[f[0]].id}', '${createdProfiles[f[1]].id}')`,
           )
           .join(',')}`,
      )
    })
    .then(() => {
      console.log('database seeded successfully')
      process.exit()
    })
}

seed()
