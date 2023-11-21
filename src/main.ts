import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  // Init app
  const app = await NestFactory.create(AppModule);

  // Prefix
  app.setGlobalPrefix('api');

  // Versioning with URI (/api/v1/... /api/v2/...)
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Serializers
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Matches Bug Reproduction')
    .setDescription(
      'Demo API to reproduce the bug caused by using matches in API validation',
    )
    .setVersion('1.0.0')
    .addServer('http://localhost:3000')
    .addBearerAuth({ bearerFormat: 'JWT', type: 'http', scheme: 'bearer' })
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup('/docs', app, document, swaggerOptions);

  await app.listen(3000);
}

bootstrap();
