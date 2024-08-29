import { compare } from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './types/token-payload.interface';
import { EnvService } from 'src/common/env/env.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private envService: EnvService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    return compare(plainTextPassword, hashedPassword);
  }

  async getAuthenticatedUser(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string }> {
    const user = await this.usersService.findOneWithPassword(username);
    if (!user) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordMatching = await this.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Passwords did not match',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { id: user.id, username: user.username };
  }

  getCookieWithJwtAccessToken(user: { id: number; username: string }) {
    const payload: TokenPayload = {
      username: user.username,
      sub: user.id.toString(),
    };
    const token = this.jwtService.sign(payload, {
      secret: this.envService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.envService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${this.envService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      cookie,
      token,
    };
  }
}
