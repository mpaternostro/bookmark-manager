import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UsePipes,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { RequestWithUser } from '../core/auth/types/request-with-user.interface';
import { JwtAuthGuard } from '../core/auth/guard/jwt-auth.guard';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { BookmarksService } from './bookmarks.service';
import {
  CreateBookmarkDto,
  createBookmarkSchema,
} from './dto/create-bookmark.dto';
import {
  UpdateBookmarkDto,
  updateBookmarkSchema,
} from './dto/update-bookmark.dto';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('new')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createBookmarkSchema))
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @Request() req: RequestWithUser,
  ) {
    return this.bookmarksService.create(createBookmarkDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.bookmarksService.findAll(req.user.id);
  }

  @Patch(':id')
  @HttpCode(204)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateBookmarkSchema))
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    return this.bookmarksService.update(id, updateBookmarkDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarksService.remove(id);
  }
}
