/* eslint-disable */
import {
  Body,
  Controller,
  Get,
  HttpCode,
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
  ApiInternalServerErrorResponse,
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
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import {
  FilterPatients,
  FilterRecordDto,
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
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class ReceptionistController {
  constructor(private readonly receptionist: ReceptionistService) {}

  //register patient
  @ApiCreatedResponse({ description: 'Patient created successfully' })
  @ApiConflictResponse({ description: 'Patient already exists' })
  @ApiBody({ type: registerPatientDto })
  @Post('register-patient')
  async registerPatient(
    @Body() dto: registerPatientDto,
    @GetUser() user: User,
  ) {
    const result = await this.receptionist.RegisterPatient(dto, user);
    return new GenericResponse('Patient created successfully', result);
  }

  @ApiOkResponse({ description: 'All Patients fetched successfully' })
  @Get('all-patients')
  async getAllPatients(@GetUser() user: User) {
    const result = await this.receptionist.getAllPatients(user);
    return new GenericResponse('All Patients fetched successfully', result);
  }

  @ApiOkResponse({ description: 'Patient fetched successfully' })
  @ApiBody({ type: FilterPatients })
  @Post('filter-patients')
  async filterPatients(@Body() dto: FilterPatients, @GetUser() user: User) {
    const result = await this.receptionist.filterPatients(dto, user);
    return new GenericResponse('Patients fetched successfully', result);
  }

  @ApiCreatedResponse({ description: 'Record created successfully' })
  @ApiQuery({ name: 'id', required: true })
  @ApiBadRequestResponse({ description: 'consultation not in priceList' })
  @ApiBody({ type: RecordDto })
  @Post('create-record')
  async sendPatientToNurse(
    @Query('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() dto: RecordDto,
  ) {
    const result = await this.receptionist.CreateRecord(id, user, dto);
    return new GenericResponse('Record created successfully', result);
  }

  @ApiOkResponse({ description: 'Records for receptionist fetched ' })
  @ApiBadRequestResponse({
    description: 'Invalid date format , format must be YYYY-MM-DD',
  })
  @Post('recept-data')
  @HttpCode(200)
  @ApiBody({ type: FilterRecordDto })
  async seeRecords(@Body() dto: FilterRecordDto, @GetUser() user: User) {
    const result = await this.receptionist.seeRecords(dto, user);
    return new GenericResponse('Records fetched successfully', result);
  }

  @ApiCreatedResponse({ description: 'Record activated ' })
  @ApiNotFoundResponse({ description: 'Record not found' })
  @ApiQuery({ type: Number, name: 'id', required: true })
  @Post('activate-record')
  async ActivateRecord(@Query('id', ParseIntPipe) id: number) {
    const result = await this.receptionist.activateRecord(id);
    return new GenericResponse('Record activated successfully', result);
  }

  @ApiOkResponse({ description: 'Record payments ' })
  @ApiQuery({ type: Number, name: 'recordId', required: true })
  @Get('record-payments')
  async GetRecordPayment(@Query('recordId', ParseIntPipe) recordId: number) {
    const result = await this.receptionist.seeRecordPayment(recordId);
    return new GenericResponse('Record payments fetched successfully', result);
  }

  @Get('view-record-payment')
  async ViewRecordPayment(
    @Query('paymentId', ParseIntPipe) paymentId: number,
    @Query('type') type: string,
  ) {
    const result = await this.receptionist.viewOneRecordPayment(
      paymentId,
      type,
    );
    return new GenericResponse('Record payment fetched successfully', result);
  }

  @ApiCreatedResponse({ description: 'Record payment created ' })
  @ApiQuery({ type: Number, name: 'recordId', required: true })
  @Post('pay-record')
  @ApiBody({ type: MakePaymentDto })
  async CreateRecordPayment(
    @Body() dto: MakePaymentDto,
    @Query('recordId', ParseIntPipe) recordId: number,
    @GetUser() user: User,
  ) {
    const result = await this.receptionist.makePayment(recordId, dto, user);
    return new GenericResponse('Record payment created successfully', result);
  }

  @ApiOkResponse({ description: 'Record invoice ' })
  @ApiQuery({ type: Number, name: 'recordId', required: true })
  @Get('view-record-invoice')
  async ViewRecordInvoice(@Query('recordId', ParseIntPipe) recordId: number) {
    const result = await this.receptionist.viewInvoiceOfRecord(recordId);
    return new GenericResponse('Record invoice fetched successfully', result);
  }

  @ApiOkResponse({ description: 'Record invoice details ' })
  @ApiQuery({ type: Number, name: 'invoiceId', required: true })
  @Get('view-record-invoice-details')
  async ViewRecordInvoiceDetails(
    @Query('invoiceId', ParseIntPipe) invoiceId: number,
  ) {
    const result = await this.receptionist.viewInvoiceDetails(invoiceId);
    return new GenericResponse(
      'Record invoice details fetched successfully',
      result,
    );
  }

  @ApiOkResponse({ description: 'Doctors ' })
  @Get('all-doctors')
  async getAllDoctors(@GetUser() user: User) {
    const result = await this.receptionist.allDoctors(user);
    return new GenericResponse('All doctors fetched successfully', result);
  }

  @ApiOkResponse({ description: 'Nurses ' })
  @Get('all-nurses')
  async getAllNurses(@GetUser() user: User) {
    const result = await this.receptionist.allNurses(user);
    return new GenericResponse('All nurses fetched successfully', result);
  }
  @ApiOkResponse({ description: 'Laborante ' })
  @Get('all-laborantes')
  async getAllLaborantes(@GetUser() user: User) {
    const result = await this.receptionist.allLaborantes(user);
    return new GenericResponse('All laborantes fetched successfully ', result);
  }
}
