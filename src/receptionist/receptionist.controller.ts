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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { FilterPatients, RecordDto, registerPatientDto } from './dto';
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

  @ApiOkResponse({ description: 'Patient fetched successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('filter-patients')
  filterPatients(@Body() dto: FilterPatients, @GetUser() user: User) {
    return this.receptionist.filterPatients(dto, user);
  }

  @ApiCreatedResponse({ description: 'Record created successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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

  @ApiOkResponse({
    description: 'All Records for receptionist fetched successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('recept-data')
  seeRecords() {
    return this.receptionist.seeRecords();
  }
  // @Post('search-patient')
  // searchPatient(@Body() dto: any) {
  //   return this.receptionist.searchPatient(dto);
  // }
}
