// Desc: Image 2 PDF API
// Date: 12/24/2023 5:41 PM
// Author Abdallah Rashed

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(8080);
}
bootstrap();
