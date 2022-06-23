import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AllowRoles } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ClinicDto } from 'src/clinic/dto/clinic.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  //register clinic
  @Post('register-clinic')
  @AllowRoles(ERoles.SUPER_ADMIN)
  registerClinic(@Body() dto: ClinicDto) {
    return this.adminService.RegisterClinic(dto);
  }
}
