/* eslint-disable */
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ClinicService } from './clinic.service';
import { registerEmployee } from './dto/clinic.dto';

@Controller('clinic')
@UseGuards(JwtGuard, RolesGuard)
export class ClinicController {
  constructor(private readonly clinic: ClinicService) {}

  @Post('register-user')
  @AllowRoles(ERoles.CLINIC)
  registerReceptionist(@Body() dto: registerEmployee, @GetUser() user: User) {
    return this.clinic.registerUser(dto, user);
  }
}
