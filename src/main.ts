import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked'

initializeTransactionalContext()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT || 3000)
}

bootstrap().then(() => {
  //run external seeders here
})
