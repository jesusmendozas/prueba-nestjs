import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prefijo global para todas las rutas
  const apiPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  // pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // habilita cors
  app.enableCors();

  // configuración de swagger
  const config = new DocumentBuilder()
    .setTitle('Prueba Tecnica Backend Mid ')
    .setDescription(
      'Esta es la documentación de la API de la prueba técnica ',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Registro y login de usuarios')
    .addTag('Plans', 'Gestión de planes de suscripción')
    .addTag('Subscriptions', 'Gestión de suscripciones de usuarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 La aplicación está corriendo en: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Documentación de Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
