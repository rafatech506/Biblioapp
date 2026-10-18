import { IsString, IsUUID, Matches } from 'class-validator';

export class CreateLoanDto {
  @IsString()
  @Matches(/^\d{5,20}$/) // Mismo formato de id que los usuarios.
  userId!: string;

  @IsUUID()
  bookId!: string;
}
