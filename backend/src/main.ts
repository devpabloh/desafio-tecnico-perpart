import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuditInterceptor } from './@shared/interceptors/audit.interceptor';
import { PrismaService } from './infra/database/prisma/prisma.service';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  app.useGlobalInterceptors(new AuditInterceptor(prismaService));

  const config = new DocumentBuilder()
    .setTitle('Desafio Tecnico Perpart API')
    .setDescription('Documentacao dos endpoints da API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
