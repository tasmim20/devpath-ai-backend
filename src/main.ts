import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  // app.setGlobalPrefix('api');

  // Use environment variable or default to 5000
  const PORT: number = Number(process.env.PORT) || 5000;

  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
}
bootstrap();
