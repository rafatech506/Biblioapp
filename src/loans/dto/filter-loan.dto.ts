import { IsIn, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

export class FilterLoanDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{5,20}$/)
  userId?: string;

  @IsOptional()
  @IsUUID()
  bookId?: string;

  /** active = sin devolver, returned = ya devueltos. */
  @IsOptional()
  @IsIn(['active', 'returned'])
  status?: 'active' | 'returned';
}
