import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { Bookmark } from './entities/bookmark.entity';

@Module({
  controllers: [BookmarksController],
  providers: [BookmarksService],
  imports: [TypeOrmModule.forFeature([Bookmark])],
})
export class BookmarksModule {}
