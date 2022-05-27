import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ClassSerializerInterceptor } from '@nestjs/common'

initializeTransactionalContext()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle("Profile's app")
    .setDescription('Api description')
    .setVersion('1.0')
    .build()

  app.setGlobalPrefix('v1')
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(process.env.PORT || 3000)
}

bootstrap().then(() => {
  //run external seeders here
})
