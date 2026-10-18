import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 200 })
  title!: string;

  @Column({ length: 150 })
  author!: string;

  @Column({ type: 'integer' })
  pages!: number;

  // Etiqueta de género en minúsculas (ej: "novela", "ciencia ficción").
  @Column({ length: 50 })
  genre!: string;

  // false mientras el libro esté prestado. Solo lo modifica el módulo de préstamos.
  @Column({ default: true })
  available!: boolean;

  @Column({ default: true })
  isActive!: boolean;
}
