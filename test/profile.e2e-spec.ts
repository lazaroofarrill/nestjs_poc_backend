import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Test } from '@nestjs/testing'
import { ProfileModule } from '../src/modules/profile/profile.module'
import { ProfileRepository } from '../src/modules/profile/repos/profile.repository'
import { Profile } from '../src/modules/profile/entities/profile.entity'
import axios from 'axios'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import * as request from 'supertest'

describe('Profile E2E Testing', () => {
  let app: INestApplication
  let repository: ProfileRepository

  beforeAll(async () => {
    if (process.env.NODE_ENV !== 'testing') {
      throw new Error('this is not a testing environment')
    }
    const module = await Test.createTestingModule({
      imports: [
        ProfileModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'developer',
          password: 'developerpassword',
          database: 'dspot_e2e_test',
          entities: ['./**/*.entity.ts'],
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
        }),
      ],
    }).compile()
    app = module.createNestApplication()
    await app.init()

    repository = module.get(ProfileRepository)
  })

  afterEach(async () => {
    await repository.query(`DELETE
                            FROM profile
                            WHERE TRUE`)
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /profile', () => {
    it('should return an array of users', async () => {
      const newUsers = (
        await Promise.all(
          Array(5)
            .fill(0)
            .map(async () => {
              // return fetch('https://randomuser.me/api/').then((response) =>
              //   response.json(),
              // )
              return axios.get('https://randomuser.me/api').then((response) => {
                return response.data.results[0]
              })
            }),
        )
      ).map(
        (u: any) =>
          ({
            firstName: u.name.first,
            lastName: u.name.last,
            email: u.email,
            password: u.login.password,
            city: u.location.city,
            state: u.location.state,
            zipcode: u.location.postcode,
            address: `${u.location.street.number} ${u.location.street.name}`,
          } as Profile),
      )
      expect(newUsers.length).toBe(5)
      await repository.save(newUsers)

      const { body } = await request
        .agent(app.getHttpServer())
        .get('/profile')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(body.length).toEqual(newUsers.length)
    })
  })
})
