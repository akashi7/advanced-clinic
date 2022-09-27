import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { CashierService } from './cashier.service';

import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MakePaymentDto } from 'src/receptionist/dto';
import { cashierDto } from './dto';

@Controller('cashier')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.CASHIER)
@ApiTags('cashier')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class CashierController {
  constructor(private readonly cashService: CashierService) {}

  @ApiCreatedResponse({ description: 'Invoice' })
  @ApiQuery({ name: 'patientCode', required: true })
  @ApiBody({ type: cashierDto })
  @Post('filter-record')
  async cashierFilterRecord(
    @GetUser() user: User,
    @Body() dto: cashierDto,
    @Query('patientCode') code: string,
  ) {
    const result = await this.cashService.GetRecordInvoice(code, dto, user);
    return new GenericResponse('Invoice retireived', result);
  }

  @ApiCreatedResponse({ description: 'payment' })
  @ApiQuery({ name: 'recordId', required: true })
  @ApiBody({ type: MakePaymentDto })
  @Post('make-payment')
  async cashierMakePayment(
    @GetUser() user: User,
    @Body() dto: MakePaymentDto,
    @Query('recordId', ParseIntPipe) id: number,
  ) {
    const result = await this.cashService.makePayment(id, dto, user);
    return new GenericResponse('Payment done', result);
  }

  @ApiOkResponse({ description: 'Payments' })
  @ApiQuery({ name: 'recordId', required: true })
  @Get('see-payments')
  async cashierSeePayments(@Query('recordId', ParseIntPipe) id: number) {
    const result = await this.cashService.seeRecordPayment(id);
    return new GenericResponse('Payments', result);
  }
}
