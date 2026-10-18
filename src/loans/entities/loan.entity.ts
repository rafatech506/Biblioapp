import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 20 })
  userId!: string;

  @Column({ length: 36 })
  bookId!: string;

  @CreateDateColumn()
  loanedAt!: Date;

  // Fecha límite para devolver el libro.
  @Column({ type: Date })
  dueAt!: Date;

  // null mientras el préstamo siga activo.
  @Column({ type: Date, nullable: true })
  returnedAt!: Date | null;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Book, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'bookId' })
  book!: Book;
}
