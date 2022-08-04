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
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { DoctorService } from './doctor.service';
import { examDto } from './dto';

@Controller('doctor')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.DOCTOR)
@ApiTags('doctor')
@ApiBearerAuth()
export class DoctorController {
  constructor(private readonly docService: DoctorService) {}

  @ApiOkResponse({ description: 'Doctor requests' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Down' })
  @Get('see-requests')
  docSeeAllRequets(@GetUser() user: User) {
    return this.docService.docSeeAllRequets(user);
  }

  @ApiOkResponse({ description: 'Doctor requests' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Server Down' })
  @Get('view-request')
  docViewRequet(@Query('id', ParseIntPipe) id: number) {
    return this.docService.docViewRequet(id);
  }

  @Post('send-to-labo')
  docSendToLabo(
    @Query('id', ParseIntPipe) id: number,
    @Query('names') fullName: string,
    @Body() dto: examDto,
  ) {
    return this.docService.docSendToLabo(id, fullName, dto);
  }
}
