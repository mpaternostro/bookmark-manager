import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
  ) {}

  create(createBookmarkDto: CreateBookmarkDto, userId: number) {
    return this.bookmarksRepository.save({
      ...createBookmarkDto,
      user: { id: userId },
    });
  }

  findAll(userId: number) {
    return this.bookmarksRepository.find({ where: { user: { id: userId } } });
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return this.bookmarksRepository.update(id, updateBookmarkDto);
  }

  remove(id: number) {
    return this.bookmarksRepository.delete({ id });
  }
}
