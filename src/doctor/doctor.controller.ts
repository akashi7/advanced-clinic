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
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
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
import { examDto } from './dto';

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
  @Get('see-requests')
  async docSeeAllRequets(@GetUser() user: User) {
    const result = await this.docService.docSeeAllRequets(user);
    return new GenericResponse('doctor requests', result);
  }

  @ApiOkResponse({ description: 'Doctor one request' })
  @Get('view-request')
  async docViewRequet(@Query('id', ParseIntPipe) id: number) {
    const result = await this.docService.docViewRequet(id);
    return new GenericResponse('doctor one request', result);
  }

  @ApiCreatedResponse({ description: 'Sent to labo' })
  @Post('send-to-labo')
  async docSendToLabo(
    @Query('recordid', ParseIntPipe) recordId: number,
    @Body() dto: examDto,
    @GetUser() user: User,
  ) {
    const result = await this.docService.docSendToLabo(user, recordId, dto);
    return new GenericResponse('sent to labo', result);
  }
}
