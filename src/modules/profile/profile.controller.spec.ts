import { Test, TestingModule } from '@nestjs/testing'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

describe('ProfileController', () => {
  let controller: ProfileController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
    })
      .useMocker((token) => {
        if (token === ProfileService) {
          return {
            findAll: jest.fn().mockResolvedValue([]),
          }
        }
      })
      .compile()

    controller = module.get<ProfileController>(ProfileController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
