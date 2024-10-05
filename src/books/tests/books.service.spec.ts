import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../books.service'; 
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity'; 
import { Member } from '../../members/entities/member.entity'; 
import { Repository } from 'typeorm';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;
  let memberRepository: Repository<Member>;

  const mockBookRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockMemberRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAvailableBooks', () => {
    it('should return all available books', async () => {
        // Mocking books data
        const books = [
            { id: 1, title: 'Book 1', isBorrowed: false },
            { id: 2, title: 'Book 2', isBorrowed: true },
            { id: 3, title: 'Book 3', isBorrowed: false },
        ];

        // Mock the find method to only return the available books
        const availableBooks = books.filter(book => !book.isBorrowed); // Only available books
        mockBookRepository.find.mockResolvedValue(availableBooks); // Mocking the method to return only available books

        // Call the service method
        const result = await service.findAvailableBooks();

        // Check if the result matches the expected output
        expect(result).toEqual(availableBooks);
    });
});
});
