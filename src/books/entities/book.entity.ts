import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Member } from '../../members/entities/member.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ default: 1 })
  stock: number;

  @Column({ default: false })
  isBorrowed: boolean;

  @Column({ type: 'date', nullable: true })
  borrowedAt: Date | null;

  @ManyToOne(() => Member, (member) => member.borrowedBooks, { nullable: true, eager: false }) // eager: false to prevent circular loading
  @JoinColumn({ name: 'borrowedByMemberId' })
  @Exclude() // This helps with serialization
  borrowedBy: Member;
}
