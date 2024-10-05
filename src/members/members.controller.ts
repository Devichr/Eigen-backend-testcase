
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { BookDto } from '../books/dtos/book.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(): Promise<Member[]> {
    return this.membersService.findAll();
  }
  @Post(':memberId/borrow/:bookId')
    async borrowBook(
        @Param('memberId') memberId: number,
        @Param('bookId') bookId: number,
    ): Promise<{ message: string; book: BookDto }> {
        return this.membersService.borrowBook(memberId, bookId);
    }

    @Post(':memberId/return/:bookId')
    async returnBook(
        @Param('memberId') memberId: number,
        @Param('bookId') bookId: number,
    ): Promise<{ message: string; book: BookDto }> {
        return this.membersService.returnBook(memberId, bookId);
    }
}
