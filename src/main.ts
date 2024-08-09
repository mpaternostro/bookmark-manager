import { NestFactory } from '@nestjs/core';
import { EnvService } from './common/env/env.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  await app.listen(port);
}
bootstrap();
