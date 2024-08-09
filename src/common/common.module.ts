import { Module } from '@nestjs/common';
import { EnvModule } from './env/env.module';
import { EnvService } from './env/env.service';

@Module({
  providers: [EnvService],
  imports: [EnvModule],
  exports: [EnvService],
})
export class CommonModule {}
