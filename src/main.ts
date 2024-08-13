import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { EnvService } from './common/env/env.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);
  const port = envService.get('PORT');
  app.enableCors({
    credentials: true,
    origin:
      envService.get('NODE_ENV') === 'development'
        ? 'http://localhost:5173'
        : undefined,
  });
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
