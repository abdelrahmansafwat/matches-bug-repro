import {
  ClassSerializerInterceptor,
  Logger,
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
import * as fs from 'fs';

import { AppModule } from './modules/app/app.module';

async function bootstrap(onlyGenerateSwagger = false) {
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
    .setTitle('JimberFW SignalServer')
    .setDescription('API for the JimberFW SignalServer')
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
  const swaggerJSON = JSON.stringify(document);
  if (
    !fs.existsSync('./swagger.json') ||
    swaggerJSON !== fs.readFileSync('./swagger.json').toString()
  ) {
    Logger.warn('swagger.json is not up to date... updating...');
    fs.writeFileSync('./swagger.json', swaggerJSON);
  }
  if (onlyGenerateSwagger) {
    Logger.warn('Only generating swagger.json... quitting...');
    return;
  }

  SwaggerModule.setup('/docs', app, document, swaggerOptions);

  await app.listen(3000);
}

const onlyGenerateSwagger = process.argv.includes('--only-generate-swagger');
bootstrap(onlyGenerateSwagger);
