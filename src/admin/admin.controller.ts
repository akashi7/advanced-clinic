import {
  Body,
  Controller,
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
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AllowRoles } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ClinicDto } from 'src/clinic/dto/clinic.dto';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  //register clinic
  @Post('register-clinic')
  @ApiCreatedResponse({ description: 'Clinic created successfully' })
  @ApiConflictResponse({ description: 'Clinic already exists' })
  @ApiBadRequestResponse({ description: 'Bad request Email not sent' })
  @ApiBody({ type: ClinicDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async RegisterClinic(@Body() dto: ClinicDto) {
    const result = await this.adminService.RegisterClinic(dto);
    return new GenericResponse('registered clinic', result);
  }
  @HttpCode(200)
  @Patch('disbale-clinic')
  @ApiOkResponse({ description: 'Clinic updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  async disableClinic(@Query('id', ParseIntPipe) clinicId: number) {
    const result = await this.adminService.disableClinic(clinicId);
    return new GenericResponse('disbaled clinic', result);
  }

  @HttpCode(200)
  @Patch('enable-clinic')
  @ApiOkResponse({ description: 'Clinic updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  async enableClinic(@Query('id', ParseIntPipe) clinicId: number) {
    const result = await this.adminService.enableClinic(clinicId);
    return new GenericResponse('enabled clinic', result);
  }

  @HttpCode(200)
  @Get('all-clinics')
  @ApiOkResponse({ description: 'All clinics received successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async GetAllClinics() {
    const result = await this.adminService.getAllClinics();
    return new GenericResponse('All clinics fetched ', result);
  }
}
