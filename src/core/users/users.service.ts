import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvService } from '../../common/env/env.service';
import { isQueryFailedError } from '../../utils/isQueryFailedError';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { PostgresErrorCodeMap } from 'src/utils/PostgresErrorCodeMap';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private envService: EnvService,
  ) {}

  private async hashString(stringToHash: string) {
    const salt = this.envService.get('PASSWORD_SALT');
    return hash(stringToHash, salt);
  }

  findOneWithPassword(
    username: string,
  ): Promise<{ id: number; username: string; password: string } | null> {
    return this.usersRepository.findOne({
      where: { username },
      select: { id: true, username: true, password: true },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    const hashedPassword = await this.hashString(createUserDto.password);
    try {
      await this.usersRepository.save({
        username: createUserDto.username,
        password: hashedPassword,
      });
      return 'User created successfully.';
    } catch (error) {
      if (
        isQueryFailedError(error) &&
        error.code === PostgresErrorCodeMap.UniqueViolation
      ) {
        throw new HttpException(
          'Username already taken',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
