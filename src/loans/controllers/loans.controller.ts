import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateLoanDto } from '../dto/create-loan.dto';
import { FilterLoanDto } from '../dto/filter-loan.dto';
import { LoansService } from '../services/loans.service';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.create(createLoanDto);
  }

  // GET /loans?userId=1234567890&status=active
  @Get()
  findAll(@Query() filters: FilterLoanDto) {
    return this.loansService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.loansService.findOne(id);
  }

  @Put(':id/return')
  returnBook(@Param('id', ParseUUIDPipe) id: string) {
    return this.loansService.returnBook(id);
  }
}
