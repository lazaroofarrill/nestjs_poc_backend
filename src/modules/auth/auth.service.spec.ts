import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { ProfileService } from '../profile/profile.service'
import { ProfileRepository } from '../profile/repos/profile.repository'
import { JwtService } from '@nestjs/jwt'
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked'

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
  IsolationLevel: { SERIALIZABLE: 'SERIALIZABLE' },
}))

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ProfileService, JwtService],
    })
      .useMocker((token) => {
        if (token === ProfileRepository) {
          return {
            save: jest.fn().mockImplementation((createDto) => ({
              id: 'created_id',
              ...createDto,
            })),
          }
        }
      })
      .compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  it('should sign up a new user', async () => {
    const newUser = {
      firstName: 'first',
      lastName: 'last',
      email: 'password',
      password: 'slick',
      address: '',
      img: '',
      phone: '',
      city: '',
      state: '',
      zipcode: '10900',
    }
    expect(service.signUp(newUser)).toEqual({
      id: 'created_id',
      ...newUser,
    })
  })
})
