import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { MembersModule } from '../members/members.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    MembersModule, 
  ],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
