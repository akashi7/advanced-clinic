/* eslint-disable */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
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
import { ClinicService } from './clinic.service';
import {
  AsignRoleDto,
  consultationDto,
  createStockDto,
  ExamDto,
  filterclinicReports,
  InsuranceDto,
  insuranceUpdateDto,
  PriceListDto,
  registerEmployee,
  UpdatePasswordDto,
  UpdatePriceListDto,
} from './dto/clinic.dto';

@Controller('clinic')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.CLINIC)
@ApiBearerAuth()
@ApiTags('clinic')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class ClinicController {
  constructor(private readonly clinic: ClinicService) {}

  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBadRequestResponse({ description: 'Bad request Email not sent' })
  @ApiBody({ type: registerEmployee })
  @Post('register-user')
  async RegisterUser(@Body() dto: registerEmployee, @GetUser() clinic: User) {
    const result = await this.clinic.RegisterUser(dto, clinic);
    return new GenericResponse('User created successfully', result);
  }

  @ApiOkResponse({ description: 'Users fecthed successfully' })
  @AllowRoles(ERoles.RECEPTIONIST, ERoles.CLINIC, ERoles.NURSE)
  @Get('get-all-users')
  async GetAllUsers(@GetUser() user: User) {
    const result = await this.clinic.getAllUsers(user);
    return new GenericResponse('Users fecthed successfully', result);
  }

  @ApiOkResponse({ description: 'User fecthed successfully' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiQuery({ name: 'role', type: String })
  @Get('view-user')
  async GetOneUser(
    @Query('id', ParseIntPipe) id: number,
    @Query('role') role: string,
  ) {
    const result = await this.clinic.getOneUser(id, role);
    return new GenericResponse('User fecthed successfully', result);
  }
  @ApiCreatedResponse({ description: 'Clinic password reset successfully' })
  @ApiConflictResponse({ description: 'Clinic password reset failed' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({ type: UpdatePasswordDto })
  @Patch('update-clinic')
  async UpdatePassword(@Body() dto: UpdatePasswordDto, @GetUser() user: User) {
    const result = await this.clinic.updatePassword(dto, user);
    return new GenericResponse('Password updated successfully', result);
  }

  @AllowRoles(ERoles.RECEPTIONIST, ERoles.CLINIC)
  @ApiOkResponse({ description: 'All insurances returned successfully' })
  @Get('all-insurance')
  async ClinicGetAllInsurance(@GetUser() user: User) {
    const result = await this.clinic.getAllInsurance(user);
    return new GenericResponse('All insurances returned successfully', result);
  }

  @ApiCreatedResponse({ description: 'Insurance created successfully' })
  @ApiConflictResponse({ description: 'Insurance already exists' })
  @ApiBody({ type: InsuranceDto })
  @Post('register-insurance')
  async RegisterInsurance(@Body() dto: InsuranceDto, @GetUser() user: User) {
    const result = await this.clinic.registerInsurance(dto, user);
    return new GenericResponse('Insurance created successfully', result);
  }

  @ApiOkResponse({ description: 'Insurance updated successfully' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiBody({ type: insuranceUpdateDto })
  @HttpCode(200)
  @Patch('update-insurance')
  async UpdateInsurance(
    @Body() dto: insuranceUpdateDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    const result = await this.clinic.updateInsurance(id, dto);
    return new GenericResponse('Insurance updated successfully', result);
  }

  @ApiOkResponse({ description: 'Insurance removed successfully' })
  @ApiQuery({ name: 'id', type: Number })
  @Delete('delete-insurance')
  async DeleteInsurance(@Query('id', ParseIntPipe) id: number) {
    const result = await this.clinic.deleteInsurance(id);
    return new GenericResponse('Insurance removed successfully', result);
  }

  @ApiOkResponse({ description: 'All consultations returned successfully' })
  @Get('all-consultation')
  @AllowRoles(ERoles.NURSE, ERoles.CLINIC, ERoles.DOCTOR)
  async ClinicGetAllConsultation(@GetUser() user: User) {
    const result = await this.clinic.getAllConsultation(user);
    return new GenericResponse(
      'All consultations returned successfully',
      result,
    );
  }

  @ApiCreatedResponse({ description: 'Consultation added successfully' })
  @ApiConflictResponse({ description: 'Consultation already exists' })
  @ApiBody({ type: consultationDto })
  @Post('register-consultation')
  async RegisterConsultation(
    @Body() dto: consultationDto,
    @GetUser() user: User,
  ) {
    const result = await this.clinic.registerConsultation(dto, user);
    return new GenericResponse('Consultation added successfully', result);
  }
  @ApiOkResponse({ description: 'Consultation updated successfully' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiBody({ type: consultationDto })
  @HttpCode(200)
  @Patch('update-consultation')
  async UpdateConsultation(
    @Body() dto: consultationDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    const result = await this.clinic.updateConsultation(dto, id);
    return new GenericResponse('Consultation updated successfully', result);
  }

  @ApiOkResponse({ description: 'Consultation deleted successfully' })
  @ApiQuery({ name: 'id', type: Number })
  @HttpCode(200)
  @Delete('delete-consultation')
  async DeleteConsultation(@Query('id', ParseIntPipe) id: number) {
    const result = await this.clinic.deleteConsultation(id);
    return new GenericResponse('Consultation deleted successfully', result);
  }

  @AllowRoles(ERoles.DOCTOR, ERoles.CLINIC)
  @ApiOkResponse({ description: 'All exams returned successfully' })
  @Get('all-exam')
  async ClinicGetAllExam(@GetUser() user: User) {
    const result = await this.clinic.getAllExams(user);
    return new GenericResponse('All exams returned successfully', result);
  }

  @ApiCreatedResponse({ description: 'Exam added successfully' })
  @ApiConflictResponse({ description: 'Exam already exists' })
  @Post('register-exam')
  async RegisterExaminations(@Body() dto: ExamDto, @GetUser() user: User) {
    const result = await this.clinic.registerExams(dto, user);
    return new GenericResponse('Exam added successfully', result);
  }

  @ApiOkResponse({ description: 'Exam updated successfully' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiBody({ type: ExamDto })
  @HttpCode(200)
  @Patch('update-exam')
  async UpdateExam(
    @Body() dto: ExamDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    const result = await this.clinic.updateExam(dto, id);
    return new GenericResponse('Exam updated successfully', result);
  }

  @ApiOkResponse({ description: 'Exam deleted successfully' })
  @ApiQuery({ name: 'id', type: Number })
  @HttpCode(200)
  @Delete('delete-exam')
  async DeleteExam(@Query('id', ParseIntPipe) id: number) {
    const result = await this.clinic.deleteExams(id);
    return new GenericResponse('Exam deleted successfully', result);
  }

  @ApiOkResponse({ description: 'Consultations price lists returned' })
  @Get('consultation-price-list')
  async ClinicGetAllConsultationPriceList(@GetUser() user: User) {
    const result = await this.clinic.getConsultationPriceList(user);
    return new GenericResponse('Consultations price lists returned', result);
  }

  @ApiOkResponse({ description: 'Exams price lists returned ' })
  @Get('exam-price-list')
  async ClinicGetAllExamPriceList(@GetUser() user: User) {
    const result = await this.clinic.getExamPriceList(user);
    return new GenericResponse('Exams price lists returned', result);
  }

  @ApiCreatedResponse({ description: 'Pricelist created successfully' })
  @ApiBody({ type: PriceListDto })
  @ApiConflictResponse({ description: 'Pricelist already exists' })
  @ApiBadRequestResponse({ description: 'Bad request invalid type ' })
  @Post('register-pricelist')
  async RegisterPriceList(@Body() dto: PriceListDto, @GetUser() user: User) {
    const result = await this.clinic.createPriceList(dto, user);
    return new GenericResponse('Pricelist created successfully', result);
  }

  @ApiOkResponse({ description: 'Pricelist updated successfully' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePriceListDto })
  @HttpCode(200)
  @Patch('update-pricelist')
  async UpdatePriceList(@Body() dto: UpdatePriceListDto, id: number) {
    const result = await this.clinic.updatePriceList(dto, id);
    return new GenericResponse('Pricelist updated successfully', result);
  }

  @ApiOkResponse({ description: 'PriceList deleted successfully' })
  @ApiQuery({ name: 'id', type: Number })
  @HttpCode(200)
  @Delete('delete-rice-list')
  async DeletePriceList(@Query('id', ParseIntPipe) id: number) {
    const result = await this.clinic.deletePriceList(id);
    return new GenericResponse('PriceList deleted successfully', result);
  }
  @ApiOkResponse({ description: 'Clinic reports' })
  @Get('clinic-reports')
  async GetClinicReport(@GetUser() user: User) {
    const result = await this.clinic.ClinicReport(user);
    return new GenericResponse('clinic reports', result);
  }

  @ApiOkResponse({ description: 'Payment reports' })
  @ApiQuery({ name: 'month', type: Number, required: false })
  @ApiQuery({ name: 'year', type: Number, required: false })
  @Get('clinic-payment-reports')
  async GetPaymentReport(
    @GetUser() user: User,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    const result = await this.clinic.PaymentReport(user, month, year);
    return new GenericResponse('clinic payment reports', result);
  }

  @ApiOkResponse({ description: 'User info' })
  @ApiQuery({ name: 'id', type: Number, required: true })
  @Get('View-One-User')
  async viewUserTable(@Query('id', ParseIntPipe) id: number) {
    const result = await this.clinic.ViewUser(id);
    return new GenericResponse('User info', result);
  }

  @ApiCreatedResponse({ description: 'Assign Roles' })
  @Post('assign-roles')
  @ApiBody({ type: AsignRoleDto })
  async AssignRoles(
    @Body('') dto: AsignRoleDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    const result = await this.clinic.asignRolesToUsers(id, dto);
    return new GenericResponse('User Roles', result);
  }

  @ApiCreatedResponse({ description: 'Assign Roles' })
  @Post('update-roles')
  @ApiBody({ type: AsignRoleDto })
  async UpdateRoles(
    @Body('') dto: AsignRoleDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    const result = await this.clinic.removeRoles(id, dto);
    return new GenericResponse('User Roles updated', result);
  }

  @ApiCreatedResponse({ description: 'item added to stock' })
  @ApiConflictResponse({ description: 'Medcine name arleady registered' })
  @ApiBody({ type: createStockDto })
  @Post('add-item-to-stock')
  async createStock(@Body() dto: createStockDto, @GetUser() user: User) {
    const result = await this.clinic.createStock(dto, user);
    return new GenericResponse('item added to stock', result);
  }
  @ApiOkResponse({ description: 'All stock returned stock' })
  @Get('all-stock')
  async allStockItem(@GetUser() user: User) {
    const result = await this.clinic.allStock(user);
    return new GenericResponse('all Stock', result);
  }

  @ApiOkResponse({ description: 'stock item returned ' })
  @ApiQuery({ name: 'id', required: true })
  @Get('view-one-stock-item')
  async viewOneItem(@Query('id', ParseIntPipe) id: number) {
    const result = await this.clinic.viewOneStock(id);
    return new GenericResponse('one item stock', result);
  }

  @HttpCode(200)
  @ApiOkResponse({ description: 'stock item updated success' })
  @Patch('update-stock-item')
  @ApiBody({ type: createStockDto })
  @ApiQuery({ name: 'id', required: true })
  async updateItem(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: createStockDto,
  ) {
    const result = await this.clinic.updateStock(id, dto);
    return new GenericResponse('Updated item success', result);
  }

  @Delete('delete-stock-item')
  @HttpCode(200)
  @ApiOkResponse({ description: 'stock item deleted success' })
  @ApiQuery({ name: 'id', required: true })
  async removeItem(@Query('id', ParseIntPipe) id: number) {
    const result = await this.clinic.deleteStock(id);
    return new GenericResponse('Deleted stock item', result);
  }

  @Get('stock-priceList')
  @AllowRoles(ERoles.NURSE, ERoles.CLINIC)
  @ApiOkResponse({ description: 'stock pricelist' })
  async getStockPriceList(@GetUser() user: User) {
    const result = await this.clinic.getStockPriceList(user);
    return new GenericResponse('stock priceList', result);
  }

  @Post('report-generate')
  async generateReport(
    @Body() dto: filterclinicReports,
    @GetUser() user: User,
  ) {
    const result = await this.clinic.clinicViewReport(user, dto);
    return new GenericResponse('filtered reports', result);
  }

  @ApiOkResponse({ description: 'Diseases found' })
  @Get('all-diseases-found')
  async seeDeases(@GetUser() user: User) {
    const result = await this.clinic.totalDiseaseFound(user);
    return new GenericResponse('Diseases', result);
  }

  @ApiOkResponse({ description: 'Services offered' })
  @Get('all-services-offered')
  async seeServices(@GetUser() user: User) {
    const result = await this.clinic.servicesOffered(user);
    return new GenericResponse('Services', result);
  }
}
