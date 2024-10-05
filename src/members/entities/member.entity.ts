import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  penaltyUntil: Date | null;

  @OneToMany(() => Book, (book) => book.borrowedBy, { eager: false }) // Avoid eager loading
  @Exclude() // This is for serialization
  borrowedBooks: Book[];
}
