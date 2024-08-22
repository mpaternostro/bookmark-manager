import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RequestWithUser } from './types/request-with-user.interface';
import { getCookiesForLogOut } from './utils/getCookiesForLogOut';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  whoami(@Request() req: RequestWithUser): RequestWithUser['user'] {
    if (req.user) {
      return req.user;
    }
    throw new HttpException('Logged Out', HttpStatus.UNAUTHORIZED);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.authService.register(createUserDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    const { user, res } = req;

    if (!res) {
      throw new Error('Cannot access Response.');
    }

    const { cookie: accessTokenCookie } =
      this.authService.getCookieWithJwtAccessToken(user);
    res.setHeader('Set-Cookie', [accessTokenCookie]);
    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(@Request() req: RequestWithUser) {
    const { res } = req;
    if (!res) {
      throw new Error('Cannot access Response.');
    }
    res.setHeader('Set-Cookie', getCookiesForLogOut());
    return 'Successfully logged out';
  }
}
