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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
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
import { DoctorService } from './doctor.service';
import { examDto, FilterResult, ObservationDto } from './dto';

@Controller('doctor')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.DOCTOR)
@ApiTags('doctor')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class DoctorController {
  constructor(private readonly docService: DoctorService) {}

  @ApiOkResponse({ description: 'Doctor requests' })
  @Post('see-requests')
  @ApiBody({ type: FilterResult })
  async docSeeAllRequets(@GetUser() user: User, @Body() dto: FilterResult) {
    const result = await this.docService.docSeeAllRequets(user, dto);
    return new GenericResponse('doctor requests', result);
  }

  @ApiOkResponse({ description: 'Doctor one request' })
  @ApiQuery({ name: 'recordIdDetails', required: true })
  @Get('view-request')
  async docViewRequet(@Query('recordIdDeatails', ParseIntPipe) id: number) {
    const result = await this.docService.docViewRequet(id);
    return new GenericResponse('doctor one request', result);
  }

  @ApiCreatedResponse({ description: 'Sent to labo' })
  @ApiQuery({ name: 'recordid', required: true })
  @ApiBody({ type: examDto })
  @ApiBadRequestResponse({ description: 'Exam not in PriceList' })
  @Post('send-to-labo')
  async docSendToLabo(
    @Query('recordid', ParseIntPipe) recordId: number,
    @Body() dto: examDto,
    @GetUser() user: User,
  ) {
    const result = await this.docService.docSendToLabo(user, recordId, dto);
    return new GenericResponse('sent to labo', result);
  }

  @ApiCreatedResponse({ description: 'Sent to labo' })
  @ApiQuery({ name: 'recordId', required: true })
  @ApiBody({ type: ObservationDto })
  @Post('terminate-record')
  async docTerminateRecordProccess(
    @Query('recordId', ParseIntPipe) id: number,
    @Body() dto: ObservationDto,
  ) {
    const result = await this.docService.docTerminateRecordProccess(id, dto);
    return new GenericResponse('Terminated record', result);
  }

  @ApiOkResponse({ description: 'doc report' })
  @Get('doc-reports')
  async docseeReport(@GetUser() user: User) {
    const result = await this.docService.docReport(user);
    return new GenericResponse('doc report', result);
  }
}
