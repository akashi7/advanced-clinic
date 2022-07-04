import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowRoles } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { DoctorService } from './doctor.service';
import { examDto } from './dto';

@Controller('doctor')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.DOCTOR)
export class DoctorController {
  constructor(private readonly docService: DoctorService) {}

  @Get('see-requests')
  docSeeAllRequets() {
    return this.docService.docSeeAllRequets();
  }

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
