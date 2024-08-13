import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CommonModule } from './common/common.module';
import { envSchema } from './common/env/env';
import { EnvService } from './common/env/env.service';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      extraProviders: [EnvService],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        url: envService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize:
          envService.get('NODE_ENV') === 'development' ? true : false,
      }),
    }),
    BookmarksModule,
    CommonModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
