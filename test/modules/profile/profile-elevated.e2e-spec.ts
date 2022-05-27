import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import * as request from 'supertest'
import { DeepPartial } from 'typeorm'
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked'
import { ConfigModule } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { genSalt } from 'bcrypt'
import { Role } from '../../../src/modules/profile/constants/role'
import { ProfileRepository } from '../../../src/modules/profile/repos/profile.repository'
import { Profile } from '../../../src/modules/profile/entities/profile.entity'
import { ModulesModule } from '../../../src/modules/modules.module'

describe('Profile Module Elevated', () => {
  let app: INestApplication
  let profileRepository: ProfileRepository
  let authToken: string
  const adminUser: DeepPartial<Profile> = {
    firstName: 'Ramón',
    lastName: 'Voera',
    email: 'ramoncito3312@gmail.com',
    password: 'romn',
    city: 'Brusque',
    state: 'Rondônia',
    zipcode: '20895',
    address: '9068 Rua Primeiro de Maio ',
    img: 'https://randomuser.me/api/portraits/thumb/women/5.jpg',
    roles: [Role.ADMIN],
  }

  beforeAll(async () => {
    if (process.env.NODE_ENV !== 'testing') {
      throw new Error('this is not a testing environment')
    }
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ModulesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'developer',
          password: 'developerpassword',
          database: 'dspot_e2e_test',
          entities: ['./**/*.entity.ts'],
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
        }),
      ],
    }).compile()
    initializeTransactionalContext()
    app = module.createNestApplication()
    await app.init()

    profileRepository = module.get(ProfileRepository)
  })

  beforeEach(async () => {
    const { password, ...rest } = adminUser
    const salt = await genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await profileRepository.save({ ...rest, password: hash })

    const { body } = await request
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ramoncito3312@gmail.com',
        password: 'romn',
      })
    expect(body.access_token).toBeDefined()
    authToken = body.access_token
  })

  afterEach(async () => {
    return profileRepository.manager.transaction(async (manager) => {
      await Promise.all([
        manager.query('DELETE FROM profile WHERE TRUE'),
        manager.query('DELETE FROM profile_friends_profile WHERE TRUE'),
      ])
    })
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /profile', () => {
    it('should return an array of users', async () => {
      const newUsers: DeepPartial<Profile>[] = [
        {
          firstName: 'Adelina',
          lastName: 'Vieira',
          email: 'adelina.vieira@example.com',
          password: '252525',
          city: 'Brusque',
          state: 'Rondônia',
          zipcode: '20895',
          address: '9068 Rua Primeiro de Maio ',
          img: 'https://randomuser.me/api/portraits/thumb/women/5.jpg',
        },
        {
          firstName: 'Agathe',
          lastName: 'Schnoor',
          email: 'agathe.schnoor@example.com',
          password: 'slick',
          city: 'Zwönitz',
          state: 'Brandenburg',
          zipcode: '28531',
          address: '3984 Feldstraße',
          img: 'https://randomuser.me/api/portraits/thumb/women/13.jpg',
        },
        {
          firstName: 'Simon',
          lastName: 'Ennis',
          email: 'simon.ennis@example.com',
          password: 'fart',
          city: 'Greenwood',
          state: 'Nova Scotia',
          zipcode: 'H8Y 2N4',
          address: '8634 St. Catherine St',
          img: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
        },
        {
          firstName: 'Olav',
          lastName: 'Rusten',
          email: 'olav.rusten@example.com',
          password: 'gregor',
          city: 'Risør',
          state: 'Hedmark',
          zipcode: '9059',
          address: '1355 Østre vei',
          img: 'https://randomuser.me/api/portraits/thumb/men/42.jpg',
        },
        {
          firstName: 'Jose',
          lastName: 'Carrasco',
          email: 'jose.carrasco@example.com',
          password: 'brittney',
          city: 'Orihuela',
          state: 'Navarra',
          zipcode: '21119',
          address: '1527 Calle de Arturo Soria',
          img: 'https://randomuser.me/api/portraits/thumb/men/53.jpg',
        },
        {
          firstName: 'Gundula',
          lastName: 'Hecker',
          email: 'gundula.hecker@example.com',
          password: 'hercules',
          city: 'Weilheim-Schongau',
          state: 'Mecklenburg-Vorpommern',
          zipcode: '31325',
          address: '3725 Schützenstraße',
          img: 'https://randomuser.me/api/portraits/thumb/women/5.jpg',
        },
      ]
      await profileRepository.save(newUsers)
      const users = await profileRepository.find()

      const { body } = await request
        .agent(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(body.length).toEqual(users.length)
      expect(body[0].password).toBeUndefined()
    })
  })
  describe('POST /profile', () => {
    it('should create a new profile', async () => {
      const newProfile = {
        firstName: 'Adelina',
        lastName: 'Vieira',
        email: 'adelina.vieira@example.com',
        password: '252525',
        city: 'Brusque',
        state: 'Rondônia',
        zipcode: '20895',
        address: '9068 Rua Primeiro de Maio ',
        img: 'https://randomuser.me/api/portraits/thumb/women/5.jpg',
      }

      await request
        .agent(app.getHttpServer())
        .post('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProfile)
        .expect(201)

      const { body } = await request
        .agent(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
      expect(body.length).toBe(2)
    })
  })
  describe('PATCH /profile', () => {
    it('should update the admin profile', async function () {
      const admin = await profileRepository.findOne({ email: adminUser.email })
      const newEmail = 'lorain123@gmail.com'
      await request
        .agent(app.getHttpServer())
        .patch(`/profile/${admin.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: newEmail,
        })
        .expect(200)

      const { body } = await request
        .agent(app.getHttpServer())
        .get(`/profile/${admin.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(body.email).toBe(newEmail)
    })
  })
  describe('DELETE /profile', () => {
    it('should delete a profile', async function () {
      const newProfile = {
        firstName: 'Adelina',
        lastName: 'Vieira',
        email: 'adelina.vieira@example.com',
        password: '252525',
        city: 'Brusque',
        state: 'Rondônia',
        zipcode: '20895',
        address: '9068 Rua Primeiro de Maio ',
        img: 'https://randomuser.me/api/portraits/thumb/women/5.jpg',
      }
      const createdProfile = await profileRepository.save(newProfile)
      await request
        .agent(app.getHttpServer())
        .get(`/profile/${createdProfile.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
      await request
        .agent(app.getHttpServer())
        .delete(`/profile/${createdProfile.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
      await request
        .agent(app.getHttpServer())
        .get(`/profile/${createdProfile.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
    })
  })
  describe('Friends operations', () => {
    let createdUsers: Profile[]
    beforeEach(async () => {
      const newUsers = [
        {
          firstName: 'Adelina',
          lastName: 'Vieira',
          email: 'adelina.vieira@example.com',
          password: '252525',
          city: 'Brusque',
          state: 'Rondônia',
          zipcode: '20895',
          address: '9068 Rua Primeiro de Maio ',
          img: 'https://randomuser.me/api/portraits/thumb/women/5.jpg',
        },
        {
          firstName: 'Agathe',
          lastName: 'Schnoor',
          email: 'agathe.schnoor@example.com',
          password: 'slick',
          city: 'Zwönitz',
          state: 'Brandenburg',
          zipcode: '28531',
          address: '3984 Feldstraße',
          img: 'https://randomuser.me/api/portraits/thumb/women/13.jpg',
        },
        {
          firstName: 'Simon',
          lastName: 'Ennis',
          email: 'simon.ennis@example.com',
          password: 'fart',
          city: 'Greenwood',
          state: 'Nova Scotia',
          zipcode: 'H8Y 2N4',
          address: '8634 St. Catherine St',
          img: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
        },
        {
          firstName: 'Olav',
          lastName: 'Rusten',
          email: 'olav.rusten@example.com',
          password: 'gregor',
          city: 'Risør',
          state: 'Hedmark',
          zipcode: '9059',
          address: '1355 Østre vei',
          img: 'https://randomuser.me/api/portraits/thumb/men/42.jpg',
        },
        {
          firstName: 'Jose',
          lastName: 'Carrasco',
          email: 'jose.carrasco@example.com',
          password: 'brittney',
          city: 'Orihuela',
          state: 'Navarra',
          zipcode: '21119',
          address: '1527 Calle de Arturo Soria',
          img: 'https://randomuser.me/api/portraits/thumb/men/53.jpg',
        },
        {
          firstName: 'Gundula',
          lastName: 'Hecker',
          email: 'gundula.hecker@example.com',
          password: 'hercules',
          city: 'Weilheim-Schongau',
          state: 'Mecklenburg-Vorpommern',
          zipcode: '31325',
          address: '3725 Schützenstraße',
          img: 'https://randomuser.me/api/portraits/thumb/women/5.jpg',
        },
        {
          firstName: 'Emilia',
          lastName: 'Kyllo',
          email: 'emilia.kyllo@example.com',
          password: 'customer',
          city: 'Loviisa',
          state: 'Tavastia Proper',
          zipcode: '36564',
          address: '3045 Aleksanterinkatu',
          img: 'https://randomuser.me/api/portraits/thumb/women/21.jpg',
        },
        {
          firstName: 'Syver',
          lastName: 'Mehus',
          email: 'syver.mehus@example.com',
          password: 'freaks',
          city: 'Beitostølen',
          state: 'Hordaland',
          zipcode: '9479',
          address: '1940 Charlotte Andersens vei',
          img: 'https://randomuser.me/api/portraits/thumb/men/0.jpg',
        },
        {
          firstName: 'Ariana',
          lastName: 'Edwards',
          email: 'ariana.edwards@example.com',
          password: 'pinhead',
          city: 'Rotorua',
          state: 'Manawatu-Wanganui',
          zipcode: '71844',
          address: '3461 Great South Road',
          img: 'https://randomuser.me/api/portraits/thumb/women/84.jpg',
        },
        {
          firstName: 'Larry',
          lastName: 'Caldwell',
          email: 'larry.caldwell@example.com',
          password: 'platypus',
          city: 'Ballinasloe',
          state: 'Louth',
          zipcode: '17621',
          address: '2577 The Drive',
          img: 'https://randomuser.me/api/portraits/thumb/men/36.jpg',
        },
      ]
      createdUsers = await profileRepository.save(newUsers)

      createdUsers[0].Friends = [
        createdUsers[1],
        createdUsers[2],
        createdUsers[3],
      ]
      createdUsers[2].Friends = [
        createdUsers[1],
        createdUsers[3],
        createdUsers[4],
        createdUsers[5],
      ]
      createdUsers[5].Friends = [
        createdUsers[6],
        createdUsers[2],
        createdUsers[3],
      ]
      await profileRepository.save(createdUsers)
    })

    it('should get path between two users', async () => {
      const req = await request
        .agent(app.getHttpServer())
        .get(`/profile/distance/${createdUsers[0].id}/${createdUsers[6].id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'application/json')
        .expect(200)

      expect(req.body).toEqual([
        createdUsers[0].id,
        createdUsers[2].id,
        createdUsers[5].id,
        createdUsers[6].id,
      ])
    })

    it("should get a user' friends", async () => {
      const { body } = await request
        .agent(app.getHttpServer())
        .get(`/profile/${createdUsers[2].id}/friends`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(body.length).toBe(4)
      expect(body[0].password).toBeUndefined()
    })

    it('should add friends to users', async () => {
      await request
        .agent(app.getHttpServer())
        .get(`/profile/${createdUsers[1].id}/friends/add/${createdUsers[6].id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      const createdFriend = await profileRepository
        .createQueryBuilder('c')
        .innerJoin('c.Friends', 'f', 'f.id = :fId', {
          fId: createdUsers[6].id,
        })
        .where('c.id = :pId', { pId: createdUsers[1].id })
        .getOne()

      expect(createdFriend).toBeDefined()
    })

    it('should connect two friends', async function () {
      await request
        .agent(app.getHttpServer())
        .get(
          `/profile/friends/connect/${createdUsers[1].id}/${createdUsers[6].id}`,
        )
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      const createdFriend = profileRepository
        .createQueryBuilder('c')
        .innerJoin('c.Friends', 'f', 'f.id = :fId', {
          fId: createdUsers[6].id,
        })
        .where('c.id = :pId', { pId: createdUsers[1].id })
        .getOne()

      expect(createdFriend).toBeDefined()
      const createdFriendr = profileRepository
        .createQueryBuilder('c')
        .innerJoin('c.Friends', 'f', 'f.id = :fId', {
          fId: createdUsers[1].id,
        })
        .where('c.id = :pId', { pId: createdUsers[6].id })
        .getOne()

      expect(createdFriendr).toBeDefined()
    })
  })
})
