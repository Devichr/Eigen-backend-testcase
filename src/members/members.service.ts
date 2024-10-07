import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { Book } from '../books/entities/book.entity';
import { BookDto } from '../books/dtos/book.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  findAll(): Promise<Member[]> {
    return this.memberRepository.find(); // Assuming you're using a repository
  }

  async borrowBook(memberId: number, bookId: number): Promise<{ message: string; book: BookDto }> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });  // Corrected to use an object

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['borrowedBooks'],
    });
    
    if (!member) throw new NotFoundException('Member not found');

    if (member.borrowedBooks.length >= 2) {
      throw new BadRequestException('Member can only borrow up to 2 books');
    }

    if (book.isBorrowed) {
      throw new BadRequestException('Book is not available.');
    }

    // Update book status and add to member's borrowed books
    book.isBorrowed = true;
    book.borrowedBy = member;

    member.borrowedBooks.push(book);

    await this.bookRepository.save(book);
    await this.memberRepository.save(member);

    // Convert book to BookDto and return response
    const bookDto: BookDto = {
      id: book.id,
      code: book.code,
      title: book.title,
      author: book.author,
      stock: book.stock,
      isBorrowed: book.isBorrowed,
      borrowedBy: member.id, // Passing only the member's ID
    };

    return {
      message: `Book '${book.title}' successfully borrowed by ${member.name}`,
      book: bookDto,  // Ensure BookDto type
    };
  }

  async returnBook(memberId: number, bookId: number): Promise<{ message: string; book: BookDto }> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['borrowedBooks'],
    });
    
    if (!member) throw new NotFoundException('Member not found');

    const borrowedBook = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['borrowedBy'],
    });

    if (!borrowedBook || !borrowedBook.isBorrowed || borrowedBook.borrowedBy.id !== memberId) {
      throw new BadRequestException('Book was not borrowed by this member');
    }

    // Update book status and remove from member's borrowed books
    borrowedBook.isBorrowed = false;
    borrowedBook.borrowedBy = null;

    member.borrowedBooks = member.borrowedBooks.filter(b => b.id !== bookId);

    await this.bookRepository.save(borrowedBook);
    await this.memberRepository.save(member);

    // Convert the returned book to BookDto
    const bookDto: BookDto = {
      id: borrowedBook.id,
      code: borrowedBook.code,
      title: borrowedBook.title,
      author: borrowedBook.author,
      stock: borrowedBook.stock,
      isBorrowed: borrowedBook.isBorrowed,
      borrowedBy: null, // No longer borrowed by anyone
    };

    return {
      message: `Book '${borrowedBook.title}' successfully returned by ${member.name}`,
      book: bookDto,
    };
  }
}
