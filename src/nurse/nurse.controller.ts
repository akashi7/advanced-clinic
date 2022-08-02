import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AllowRoles } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { vitalsDto } from './dto';
import { NurseService } from './nurse.service';

@Controller('nurse')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.NURSE)
@ApiTags('Nurse')
export class NurseController {
  constructor(private readonly nurseService: NurseService) {}

  @ApiOkResponse({ description: ' requests fetched sucessfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all-requests')
  nurseSeeRequest() {
    return this.nurseService.nurseSeeAllRequets();
  }

  @ApiCreatedResponse({ description: ' vitals registered success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: vitalsDto })
  @ApiQuery({ name: 'id', type: Number })
  @ApiQuery({ name: 'recordId', type: Number })
  @Post('register-vitals')
  nurseRegisterVitals(
    @Body() dto: vitalsDto,
    @Query('id', ParseIntPipe) id: number,
    @Query('recordId', ParseIntPipe) recordId: number,
  ) {
    return this.nurseService.nurseRegisterVitals(dto, id, recordId);
  }

  @ApiOkResponse({ description: ' one record fetched succesfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('view-request')
  viewRecord(@Query('id', ParseIntPipe) id: number) {
    return this.nurseService.viewRequest(id);
  }

  @ApiCreatedResponse({ description: ' Record sent to doctor' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('send-to-doc')
  nurseTransferToDoc(
    @Query('id', ParseIntPipe) recordId: number,
    @Query('names') fullName: string,
  ) {
    return this.nurseService.nurseSendToDoc(recordId, fullName);
  }
  @HttpCode(200)
  @ApiOkResponse({ description: ' Vitals updated Succesfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch('update-vitals')
  updateSignVitals(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: vitalsDto,
  ) {
    return this.nurseService.updateSignVitals(id, dto);
  }
}
