import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from '../dto/create-book.dto';
import { FilterBookDto } from '../dto/filter-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Book } from '../entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  /**
   * Lista libros activos. Si llegan `title` y/o `author`, filtra por
   * coincidencia parcial; con ambos, el libro debe cumplir los dos.
   */
  findAll(filters: FilterBookDto = {}): Promise<Book[]> {
    const query = this.booksRepository
      .createQueryBuilder('book')
      .where('book.isActive = :isActive', { isActive: true });

    if (filters.title) {
      query.andWhere("LOWER(book.title) LIKE :title ESCAPE '\\'", {
        title: `%${this.escapeLike(filters.title.toLowerCase())}%`,
      });
    }

    if (filters.author) {
      query.andWhere("LOWER(book.author) LIKE :author ESCAPE '\\'", {
        author: `%${this.escapeLike(filters.author.toLowerCase())}%`,
      });
    }

    if (filters.available !== undefined) {
      query.andWhere('book.available = :available', {
        available: filters.available,
      });
    }

    return query.orderBy('book.title', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id, isActive: true });
    if (!book) {
      throw new NotFoundException(`El libro con el id: ${id} no existe`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return this.booksRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    if (!book.available) {
      throw new ConflictException(
        'No se puede eliminar un libro que está prestado',
      );
    }
    book.isActive = false;
    await this.booksRepository.save(book);
  }

  // Evita que % o _ escritos por el usuario actúen como comodines.
  private escapeLike(value: string): string {
    return value.replace(/[\\%_]/g, '\\$&');
  }
}
