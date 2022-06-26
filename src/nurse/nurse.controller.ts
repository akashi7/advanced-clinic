import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowRoles } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { vitalsDto } from './dto';
import { NurseService } from './nurse.service';

@Controller('nurse')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.NURSE)
export class NurseController {
  constructor(private readonly nurseService: NurseService) {}

  @Get('all-requests')
  nurseSeeRequest() {
    return this.nurseService.nurseSeeAllRequets();
  }

  @Post('register-vitals')
  nurseRegisterVitals(
    @Body() dto: vitalsDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.nurseService.nurseRegisterVitals(dto, id);
  }

  @Get('view-request')
  viewRecord(@Query('id', ParseIntPipe) id: number) {
    return this.nurseService.viewRequest(id);
  }

  @Post('send-to-doc')
  nurseTransferToDoc(
    @Query('id', ParseIntPipe) recordId: number,
    @Query('names') fullName: string,
  ) {
    return this.nurseService.nurseSendToDoc(recordId, fullName);
  }
  @Patch('update-vitals')
  updateSignVitals(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: vitalsDto,
  ) {
    return this.nurseService.updateSignVitals(id, dto);
  }
}
