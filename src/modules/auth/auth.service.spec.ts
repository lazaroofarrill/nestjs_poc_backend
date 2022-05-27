import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { ProfileService } from '../profile/profile.service'
import { ProfileRepository } from '../profile/repos/profile.repository'
import { JwtService } from '@nestjs/jwt'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ProfileService, JwtService],
    })
      .useMocker((token) => {
        if (token === ProfileRepository) {
          return {}
        }
      })
      .compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
