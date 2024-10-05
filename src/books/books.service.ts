import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class BooksService implements OnModuleInit {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async onModuleInit() {
    await this.seedBooks();
  }

  async seedBooks() {
    const mockBooks = [
      { code: "JK-45", title: "Harry Potter", author: "J.K Rowling", stock: 1 },
      { code: "SHR-1", title: "A Study in Scarlet", author: "Arthur Conan Doyle", stock: 1 },
      { code: "TW-11", title: "Twilight", author: "Stephenie Meyer", stock: 1 },
      { code: "HOB-83", title: "The Hobbit, or There and Back Again", author: "J.R.R. Tolkien", stock: 1 },
      { code: "NRN-7", title: "The Lion, the Witch and the Wardrobe", author: "C.S. Lewis", stock: 1 },
    ];

    for (const book of mockBooks) {
      const exists = await this.booksRepository.findOneBy({ code: book.code });
      if (!exists) {
        this.booksRepository.save(book);
      }
    }
  }

  findAll(): Promise<Book[]> {
    return this.booksRepository.find({ relations: ['borrowedBy'] });
  }

  async findAvailableBooks(): Promise<Book[]> {
    return this.booksRepository.find({
        where: {
            isBorrowed: false,
        },
    });
}
}
