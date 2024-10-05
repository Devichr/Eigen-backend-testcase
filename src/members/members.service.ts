// members.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  async borrowBook(memberId: number, bookId: number) {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['borrowedBooks'],
    });    if (!member) throw new NotFoundException('Member not found');

    if (member.borrowedBooks.length >= 2) {
      throw new BadRequestException('Member can only borrow up to 2 books');
    }

    const book = await this.bookRepository.findOne({
      where:{ id: bookId }
    });
    if (!book) throw new NotFoundException('Book not found');
    if (book.isBorrowed) throw new BadRequestException('Book is not available.');

    // Update book status and add to member's borrowed books
    book.isBorrowed = true;
    book.borrowedBy = member;

    member.borrowedBooks.push(book);

    await this.bookRepository.save(book);
    await this.memberRepository.save(member);

    return {
      message: `Book '${book.title}' successfully borrowed by ${member.name}`,
      book,
    };
  }

  async returnBook(memberId: number, bookId: number) {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['borrowedBooks'],
    });    if (!member) throw new NotFoundException('Member not found');

    const book = await this.bookRepository.findOne({
      where: {id: bookId}
      ,relations: ['borrowedBy'] 
  });
    if (!book || !book.isBorrowed || book.borrowedBy.id !== memberId) {
      throw new BadRequestException('Book was not borrowed by this member');
    }

    // Update book status and remove from member's borrowed books
    book.isBorrowed = false;
    book.borrowedBy = null;

    member.borrowedBooks = member.borrowedBooks.filter(b => b.id !== bookId);

    await this.bookRepository.save(book);
    await this.memberRepository.save(member);

    return {
      message: `Book '${book.title}' successfully returned by ${member.name}`,
      book,
    };
  }
}
