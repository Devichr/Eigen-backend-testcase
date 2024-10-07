import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from '../members.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../entities/member.entity';
import { Book } from '../../books/entities/book.entity';
import { Repository } from 'typeorm';

describe('MembersService', () => {
  let service: MembersService;
  let memberRepository: Repository<Member>;
  let bookRepository: Repository<Book>;

  const mockMemberRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockBookRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('borrowBook', () => {
    it('should successfully borrow a book', async () => {
      const memberId = 1;
      const bookId = 1;

      const member = {
        id: memberId,
        name: 'Angga',
        penaltyUntil: null,
        borrowedBooks: [],
      };

      const book = {
        id: bookId,
        title: 'Harry Potter',
        code: 'JK-45',
        author : 'J.K. Rowling',
        stock: 1,
        isBorrowed: false,
        borrowedBy: null,
      };

      // Mock findOne to avoid circular reference
      mockMemberRepository.findOne.mockResolvedValue(member);
      mockBookRepository.findOne.mockResolvedValue(book);

      // Mock save function
      mockBookRepository.save.mockResolvedValue({
        ...book,
        isBorrowed: true,
        borrowedBy: { id: memberId, name: 'Angga' }, // Avoid deep nesting
      });
      mockMemberRepository.save.mockResolvedValue({
        ...member,
        borrowedBooks: [{ ...book, borrowedBy: undefined }], // Avoid circular reference here
      });

      const result = await service.borrowBook(memberId, bookId);

      expect(result).toEqual({
        message: `Book 'Harry Potter' successfully borrowed by Angga`,
        book: {
          id: book.id,
          title: book.title,
          isBorrowed: true,
          borrowedBy: 1, // Expect just the member ID here
          stock: book.stock,  // Add stock if necessary
          author: book.author,  // Add author if necessary
          code: book.code,  // Add code if necessary
        },
      });
      
    });

    it('should throw error if member has borrowed 2 books', async () => {
      const memberId = 1;
      const bookId = 1;

      const member = { id: memberId, penaltyUntil: null, borrowedBooks: [{ id: 2 }, { id: 3 }] };
      const book = { id: bookId, title: 'A Study in Scarlet', isBorrowed: false };

      
      mockMemberRepository.findOne.mockResolvedValue(member);
      mockBookRepository.findOne.mockResolvedValue(book);

      await expect(service.borrowBook(memberId, bookId)).rejects.toThrow('Member can only borrow up to 2 books');
    });

    it('should throw error if book is already borrowed', async () => {
      const memberId = 1;
      const bookId = 1;

      const member = { id: memberId, penaltyUntil: null, borrowedBooks: [] };
      const book = { id: bookId, title: 'A Study in Scarlet', isBorrowed: true };

      
      mockMemberRepository.findOne.mockResolvedValue(member);
      mockBookRepository.findOne.mockResolvedValue(book);

      await expect(service.borrowBook(memberId, bookId)).rejects.toThrow('Book is not available.');
    });
  });

  describe('returnBook', () => {
    it('should successfully return a book', async () => {
      const memberId = 1;
      const bookId = 1;

      const member = { id: memberId, name:"undefined", borrowedBooks: [{ id: bookId }] };
      const book = { id: bookId, title:"Book" , isBorrowed: true, borrowedBy: member };

      mockMemberRepository.findOne.mockResolvedValue(member);
      mockBookRepository.findOne.mockResolvedValue(book);

      const result = await service.returnBook(memberId, bookId);

      expect(result).toEqual({
        message: `Book '${book.title}' successfully returned by ${member.name}`,
        book: expect.objectContaining({
          id: book.id,
          isBorrowed: false,
          borrowedBy: null,
        }),
      });
    });
  });
});
