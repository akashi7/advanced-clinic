import {
  Body,
  Controller,
  HttpCode,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
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
  @ApiBody({ type: ClinicDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  RegisterClinic(@Body() dto: ClinicDto) {
    return this.adminService.RegisterClinic(dto);
  }
  @HttpCode(200)
  @Patch('disbale-clinic')
  @ApiOkResponse({ description: 'Clinic updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  disableClinic(@Query('id', ParseIntPipe) clinicId: number) {
    return this.adminService.disableClinic(clinicId);
  }

  @HttpCode(200)
  @Patch('enable-clinic')
  @ApiOkResponse({ description: 'Clinic updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  enableClinic(@Query('id', ParseIntPipe) clinicId: number) {
    return this.adminService.enableClinic(clinicId);
  }
}
