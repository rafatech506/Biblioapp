import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { LoansController } from './controllers/loans.controller';
import { Loan } from './entities/loan.entity';
import { LoansService } from './services/loans.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Book, User])],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
