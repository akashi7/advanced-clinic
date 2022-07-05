/* eslint-disable */
import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ClinicService } from './clinic.service';
import { registerEmployee, UpdatePasswordDto } from './dto/clinic.dto';

@Controller('clinic')
@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
export class ClinicController {
  constructor(private readonly clinic: ClinicService) {}

  @Post('register-user')
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBody({ type: registerEmployee })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @AllowRoles(ERoles.CLINIC)
  RegisterUser(@Body() dto: registerEmployee, @GetUser() clinic: User) {
    return this.clinic.RegisterUser(dto, clinic);
  }

  @Patch('update-clinic')
  @ApiCreatedResponse({ description: 'Clinic password reset successfully' })
  @ApiConflictResponse({ description: 'Clinic password reset failed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({ type: UpdatePasswordDto })
  UpdatePassword(@Body() dto: UpdatePasswordDto, @GetUser() user: User) {
    return this.clinic.updatePassword(dto, user);
  }
}
