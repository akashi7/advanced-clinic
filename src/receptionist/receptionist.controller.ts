/* eslint-disable */
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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import {
  FilterPatients,
  MakePaymentDto,
  RecordDto,
  registerPatientDto,
} from './dto';
import { ReceptionistService } from './receptionist.service';

@Controller('receptionist')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.RECEPTIONIST)
@ApiTags('receptionist')
@ApiBearerAuth()
export class ReceptionistController {
  constructor(private readonly receptionist: ReceptionistService) {}

  //register patient
  @ApiCreatedResponse({ description: 'Patient created successfully' })
  @ApiConflictResponse({ description: 'Patient already exists' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @ApiBody({ type: registerPatientDto })
  @Post('register-patient')
  registerPatient(@Body() dto: registerPatientDto, @GetUser() user: User) {
    return this.receptionist.RegisterPatient(dto, user);
  }

  @ApiOkResponse({ description: 'All Patients fetched successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @Get('all-patients')
  getAllPatients(@GetUser() user: User) {
    return this.receptionist.getAllPatients(user);
  }

  @ApiOkResponse({ description: 'Patient fetched successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @Post('filter-patients')
  filterPatients(@Body() dto: FilterPatients, @GetUser() user: User) {
    return this.receptionist.filterPatients(dto, user);
  }

  @ApiCreatedResponse({ description: 'Record created successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @ApiQuery({ name: 'id', required: true })
  @ApiQuery({ name: 'patientName', required: true })
  @Post('create-record')
  sendPatientToNurse(
    @Query('id', ParseIntPipe) id: number,
    @Query('patientName') fullName: string,
    @GetUser() user: User,
    @Body() dto: RecordDto,
  ) {
    return this.receptionist.CreateRecord(id, user, dto, fullName);
  }

  @ApiOkResponse({ description: 'All Records for receptionist fetched ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @Get('recept-data')
  seeRecords() {
    return this.receptionist.seeRecords();
  }

  @ApiCreatedResponse({ description: 'Record activated ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @ApiQuery({ type: Number, name: 'id', required: true })
  @Post('activate-record')
  ActivateRecord(@Query('id', ParseIntPipe) id: number) {
    return this.receptionist.activateRecord(id);
  }

  @ApiOkResponse({ description: 'Record payments ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @ApiQuery({ type: Number, name: 'recordId', required: true })
  @Get('record-payments')
  GetRecordPayment(@Query('recordId', ParseIntPipe) recordId: number) {
    return this.receptionist.seeRecordPayment(recordId);
  }

  @Get('view-record-payment')
  ViewRecordPayment(
    @Query('paymentId', ParseIntPipe) paymentId: number,
    @Query('type') type: string,
  ) {
    return this.receptionist.viewOneRecordPayment(paymentId, type);
  }

  @ApiCreatedResponse({ description: 'Record payment created ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @ApiQuery({ type: Number, name: 'recordId', required: true })
  @Post('pay-record')
  @ApiBody({ type: MakePaymentDto })
  CreateRecordPayment(
    @Body() dto: MakePaymentDto,
    @Query('recordId', ParseIntPipe) recordId: number,
  ) {
    return this.receptionist.makePayment(recordId, dto);
  }

  @ApiOkResponse({ description: 'Record invoice ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @ApiQuery({ type: Number, name: 'recordId', required: true })
  @Get('view-record-invoice')
  ViewRecordInvoice(@Query('recordId', ParseIntPipe) recordId: number) {
    return this.receptionist.viewInvoiceOfRecord(recordId);
  }

  @ApiOkResponse({ description: 'Record invoice details ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Error' })
  @ApiQuery({ type: Number, name: 'invoiceId', required: true })
  @Get('view-record-invoice-details')
  ViewRecordInvoiceDetails(
    @Query('invoiceId', ParseIntPipe) invoiceId: number,
  ) {
    return this.receptionist.viewInvoiceDetails(invoiceId);
  }
}
