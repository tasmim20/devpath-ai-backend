import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Set global prefix for all routes

  await app.listen(5000);
  console.log('Server is running on http://localhost:5000');
}
bootstrap();
