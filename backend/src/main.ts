import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configureApp } from './app.config';
import { AppModule } from './app.module';
import { setupSwagger } from './core/docs/swagger/swagger.setup';

async function bootstrap() {
  const app = configureApp(
    await NestFactory.create<NestExpressApplication>(AppModule),
  );

  const port = process.env.PORT || process.env.BACKEND_PORT || 4000;

  setupSwagger(app);

  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application', error);
  process.exit(1);
});
