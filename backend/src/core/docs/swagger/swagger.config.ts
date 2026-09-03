import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Users API')
  .setDescription('API de gerenciamento de usuários')
  .setVersion('1.0')
  .build();
