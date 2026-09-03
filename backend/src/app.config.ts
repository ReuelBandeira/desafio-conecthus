import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as qs from 'qs';
import { DomainExceptionFilter } from './core/domain/exception/exception.filter';

/**
 * Bootstrap-time app configuration shared by main.ts and e2e tests, so both
 * exercise the exact same pipes/filters/prefix instead of the test drifting
 * from what actually runs in production.
 */
export function configureApp(
  app: NestExpressApplication,
): NestExpressApplication {
  app.set('query parser', (str: string) => qs.parse(str));

  // /health stays unversioned: infra probes (Docker, load balancers) hit it
  // without knowing about API versioning.
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  return app;
}
