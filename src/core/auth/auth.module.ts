import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvService } from '../../common/env/env.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      extraProviders: [EnvService],
      inject: [EnvService],
      useFactory: async (envService: EnvService) => ({
        secret: envService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: envService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EnvService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
