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
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { registerPatientDto } from './dto';
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
  @ApiBody({ type: registerPatientDto })
  @Post('register-patient')
  registerPatient(@Body() dto: registerPatientDto, @GetUser() user: User) {
    return this.receptionist.RegisterPatient(dto, user);
  }

  @ApiOkResponse({ description: 'All Patients fetched successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all-patients')
  getAllPatients(@GetUser() user: User) {
    return this.receptionist.getAllPatients(user);
  }

  @Post('to-nurse')
  sendPatientToNurse(
    @Query('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Query('names') fullName: string,
    @Query('insurance') insurance: string,
    @Query('insuranceCode', ParseIntPipe) insuranceCode: number,
  ) {
    return this.receptionist.sendToNurse(
      id,
      user,
      fullName,
      insurance,
      insuranceCode,
    );
  }

  @Get('recept-data')
  seeRecords() {
    return this.receptionist.seeRecords();
  }
  // @Post('search-patient')
  // searchPatient(@Body() dto: any) {
  //   return this.receptionist.searchPatient(dto);
  // }
}
