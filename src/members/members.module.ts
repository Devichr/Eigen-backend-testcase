import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { Member } from './entities/member.entity';
import { Book } from '../books/entities/book.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]), 
    TypeOrmModule.forFeature([Book]), 
  ],
  providers: [MembersService],
  controllers: [MembersController],
  exports: [TypeOrmModule],
})
export class MembersModule {}
