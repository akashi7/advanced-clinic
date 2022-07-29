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
import { ClinicService } from './clinic.service';
import {
  consultationDto,
  ExamDto,
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
export class ClinicController {
  constructor(private readonly clinic: ClinicService) {}

  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBody({ type: registerEmployee })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('register-user')
  RegisterUser(@Body() dto: registerEmployee, @GetUser() clinic: User) {
    return this.clinic.RegisterUser(dto, clinic);
  }

  @ApiOkResponse({ description: 'Users fecthed successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('get-all-users')
  GetAllUsers(@GetUser() user: User) {
    return this.clinic.getAllUsers(user);
  }

  @ApiOkResponse({ description: 'User fecthed successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiQuery({ name: 'role', type: String })
  @Get('view-user')
  GetOneUser(
    @Query('id', ParseIntPipe) id: number,
    @Query('role') role: string,
  ) {
    return this.clinic.getOneUser(id, role);
  }
  @ApiCreatedResponse({ description: 'Clinic password reset successfully' })
  @ApiConflictResponse({ description: 'Clinic password reset failed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({ type: UpdatePasswordDto })
  @Patch('update-clinic')
  UpdatePassword(@Body() dto: UpdatePasswordDto, @GetUser() user: User) {
    return this.clinic.updatePassword(dto, user);
  }

  @ApiOkResponse({ description: 'All insurances returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all-insurance')
  ClinicGetAllInsurance(@GetUser() user: User) {
    return this.clinic.getAllInsurance(user);
  }

  @ApiCreatedResponse({ description: 'Insurance created successfully' })
  @ApiConflictResponse({ description: 'Insurance already exists' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: InsuranceDto })
  @Post('register-insurance')
  RegisterInsurance(@Body() dto: InsuranceDto, @GetUser() user: User) {
    return this.clinic.registerInsurance(dto, user);
  }

  @ApiOkResponse({ description: 'Insurance updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiBody({ type: insuranceUpdateDto })
  @HttpCode(200)
  @Patch('update-insurance')
  UpdateInsurance(
    @Body() dto: insuranceUpdateDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.clinic.updateInsurance(id, dto);
  }

  @ApiOkResponse({ description: 'Insurance removed successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @Delete('delete-insurance')
  DeleteInsurance(@Query('id', ParseIntPipe) id: number) {
    return this.clinic.deleteInsurance(id);
  }

  @ApiOkResponse({ description: 'All consultations returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all-consultation')
  ClinicGetAllConsultation(@GetUser() user: User) {
    return this.clinic.getAllConsultation(user);
  }

  @ApiCreatedResponse({ description: 'Consultation added successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiConflictResponse({ description: 'Consultation already exists' })
  @ApiBody({ type: consultationDto })
  @Post('register-consultation')
  RegisterConsultation(@Body() dto: consultationDto, @GetUser() user: User) {
    return this.clinic.registerConsultation(dto, user);
  }
  @ApiOkResponse({ description: 'Consultation updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiBody({ type: consultationDto })
  @HttpCode(200)
  @Patch('update-consultation')
  UpdateConsultation(
    @Body() dto: consultationDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.clinic.updateConsultation(dto, id);
  }

  @ApiOkResponse({ description: 'Consultation deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @HttpCode(200)
  @Delete('delete-consultation')
  DeleteConsultation(@Query('id', ParseIntPipe) id: number) {
    return this.clinic.deleteConsultation(id);
  }

  @ApiOkResponse({ description: 'All exams returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all-exam')
  ClinicGetAllExam(@GetUser() user: User) {
    return this.clinic.getAllExams(user);
  }

  @ApiCreatedResponse({ description: 'Exam added successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiConflictResponse({ description: 'Exam already exists' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('register-exam')
  RegisterExaminations(@Body() dto: ExamDto, @GetUser() user: User) {
    return this.clinic.registerExams(dto, user);
  }

  @ApiOkResponse({ description: 'Exam updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiBody({ type: ExamDto })
  @HttpCode(200)
  @Patch('update-exam')
  UpdateExam(@Body() dto: ExamDto, @Query('id', ParseIntPipe) id: number) {
    return this.clinic.updateExam(dto, id);
  }

  @ApiOkResponse({ description: 'Exam deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @HttpCode(200)
  @Delete('delete-exam')
  DeleteExam(@Query('id', ParseIntPipe) id: number) {
    return this.clinic.deleteExams(id);
  }

  @ApiOkResponse({
    description: 'Consultations price lists returned successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('consultation-price-list')
  ClinicGetAllConsultationPriceList(@GetUser() user: User) {
    return this.clinic.getConsultationPriceList(user);
  }

  @ApiOkResponse({
    description: 'Exams price lists returned successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('exam-price-list')
  ClinicGetAllExamPriceList(@GetUser() user: User) {
    return this.clinic.getExamPriceList(user);
  }

  @ApiCreatedResponse({ description: 'Pricelist created successfully' })
  @ApiBody({ type: PriceListDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiConflictResponse({ description: 'Pricelist already exists' })
  @ApiBadRequestResponse({ description: 'Bad request invalid type ' })
  @Post('register-pricelist')
  RegisterPriceList(@Body() dto: PriceListDto, @GetUser() user: User) {
    return this.clinic.createPriceList(dto, user);
  }

  @ApiOkResponse({ description: 'Pricelist updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePriceListDto })
  @HttpCode(200)
  @Patch('update-pricelist')
  UpdatePriceList(@Body() dto: UpdatePriceListDto, id: number) {
    return this.clinic.updatePriceList(dto, id);
  }

  @ApiOkResponse({ description: 'PriceList deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @HttpCode(200)
  @Delete('delete-rice-list')
  DeletePriceList(@Query('id', ParseIntPipe) id: number) {
    return this.clinic.deletePriceList(id);
  }
}
