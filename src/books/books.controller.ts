
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get all available books' })
    async getAvailableBooks() {
        return this.booksService.findAvailableBooks();
    }
}
