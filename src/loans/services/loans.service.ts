import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';
import { CreateLoanDto } from '../dto/create-loan.dto';
import { FilterLoanDto } from '../dto/filter-loan.dto';
import { Loan } from '../entities/loan.entity';

const LOAN_DAYS = 14;
const MAX_ACTIVE_LOANS_PER_USER = 3;

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loansRepository: Repository<Loan>,
    private readonly dataSource: DataSource,
  ) {}

  // Cola para ejecutar de a una las operaciones que escriben. SQLite usa una
  // sola conexión y no admite transacciones simultáneas; en PostgreSQL la
  // actualización condicional del libro sigue protegiendo entre procesos.
  private queue: Promise<unknown> = Promise.resolve();

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const run = this.queue.then(task, task);
    this.queue = run.catch(() => undefined);
    return run;
  }

  /**
   * Presta un libro. Todo ocurre en una transacción: si algo falla,
   * el libro no queda marcado como prestado.
   */
  create(createLoanDto: CreateLoanDto): Promise<Loan> {
    const { userId, bookId } = createLoanDto;

    return this.enqueue(() =>
      this.dataSource.transaction(async (manager) => {
        const user = await manager.findOneBy(User, {
          id: userId,
          isActive: true,
        });
        if (!user) {
          throw new NotFoundException(
            `El usuario con el id: ${userId} no existe`,
          );
        }

        const book = await manager.findOneBy(Book, {
          id: bookId,
          isActive: true,
        });
        if (!book) {
          throw new NotFoundException(
            `El libro con el id: ${bookId} no existe`,
          );
        }

        const activeLoans = await manager.countBy(Loan, {
          userId,
          returnedAt: IsNull(),
        });
        if (activeLoans >= MAX_ACTIVE_LOANS_PER_USER) {
          throw new ConflictException(
            `El usuario ya tiene ${MAX_ACTIVE_LOANS_PER_USER} préstamos activos`,
          );
        }

        // Actualización condicional: solo una petición puede marcar el libro
        // como prestado, incluso si llegan dos préstamos al mismo tiempo.
        const result = await manager.update(
          Book,
          { id: bookId, available: true },
          { available: false },
        );
        if (!result.affected) {
          throw new ConflictException('El libro ya está prestado');
        }

        const dueAt = new Date();
        dueAt.setDate(dueAt.getDate() + LOAN_DAYS);

        const loan = await manager.save(
          manager.create(Loan, { userId, bookId, dueAt, returnedAt: null }),
        );
        return manager.findOneOrFail(Loan, {
          where: { id: loan.id },
          relations: { book: true },
        });
      }),
    );
  }

  /** Registra la devolución y deja el libro disponible otra vez. */
  returnBook(id: string): Promise<Loan> {
    return this.enqueue(() =>
      this.dataSource.transaction(async (manager) => {
        const loan = await manager.findOne(Loan, {
          where: { id },
          relations: { book: true },
        });
        if (!loan) {
          throw new NotFoundException(`El préstamo con el id: ${id} no existe`);
        }
        if (loan.returnedAt) {
          throw new ConflictException('Este préstamo ya fue devuelto');
        }

        loan.returnedAt = new Date();
        await manager.save(Loan, loan);
        await manager.update(Book, { id: loan.bookId }, { available: true });
        loan.book.available = true;
        return loan;
      }),
    );
  }

  findAll(filters: FilterLoanDto = {}): Promise<Loan[]> {
    const query = this.loansRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.book', 'book');

    if (filters.userId) {
      query.andWhere('loan.userId = :userId', { userId: filters.userId });
    }
    if (filters.bookId) {
      query.andWhere('loan.bookId = :bookId', { bookId: filters.bookId });
    }
    if (filters.status === 'active') {
      query.andWhere('loan.returnedAt IS NULL');
    }
    if (filters.status === 'returned') {
      query.andWhere('loan.returnedAt IS NOT NULL');
    }

    return query.orderBy('loan.loanedAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Loan> {
    const loan = await this.loansRepository.findOne({
      where: { id },
      relations: { book: true },
    });
    if (!loan) {
      throw new NotFoundException(`El préstamo con el id: ${id} no existe`);
    }
    return loan;
  }
}
