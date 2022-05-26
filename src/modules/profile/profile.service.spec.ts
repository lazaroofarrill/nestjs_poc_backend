import { Test, TestingModule } from '@nestjs/testing'
import { ProfileService } from './profile.service'
import { ProfileRepository } from './repos/profile.repository'

jest.mock('typeorm-transactional-cls-hooked', () => ({
  Transactional: () => () => ({}),
  BaseRepository: class {},
  IsolationLevel: { SERIALIZABLE: 'SERIALIZABLE' },
}))

describe('ProfileService', () => {
  let service: ProfileService
  const exampleProfile = {
    firstName: 'Agathe',
    lastName: 'Schnoor',
    email: 'agathe.schnoor@example.com',
    password: 'slick',
    city: 'Zwönitz',
    state: 'Brandenburg',
    zipcode: '28531',
    address: '3984 Feldstraße',
    img: 'https://randomuser.me/api/portraits/thumb/women/13.jpg',
  }

  beforeEach(async () => {
    // initializeTransactionalContext()

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService],
    })
      .useMocker((token) => {
        if (token === ProfileRepository) {
          return {
            find: jest.fn().mockResolvedValue([exampleProfile]),
          }
        }
      })
      .compile()

    service = module.get<ProfileService>(ProfileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should get all profiles', async () => {
    expect(await service.findAll()).toEqual([exampleProfile])
  })
})
