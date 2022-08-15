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
import { vitalsDto } from './dto';
import { NurseService } from './nurse.service';

@Controller('nurse')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.NURSE)
@ApiTags('Nurse')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class NurseController {
  constructor(private readonly nurseService: NurseService) {}

  @ApiOkResponse({ description: ' requests fetched sucessfully' })
  @Get('all-requests')
  async nurseSeeRequest(@GetUser() user: User) {
    const result = await this.nurseService.nurseSeeAllRequets(user);
    return new GenericResponse('requests fetched sucessfully', result);
  }

  @ApiCreatedResponse({ description: ' vitals registered success' })
  @ApiBody({ type: vitalsDto })
  @ApiQuery({ name: 'recordId', type: Number })
  @AllowRoles(ERoles.RECEPTIONIST, ERoles.NURSE)
  @Post('register-vitals')
  async nurseRegisterVitals(
    @Body() dto: vitalsDto,
    @Query('recordId', ParseIntPipe) recordId: number,
  ) {
    const result = await this.nurseService.nurseRegisterVitals(dto, recordId);
    return new GenericResponse('vitals registered success', result);
  }

  @ApiOkResponse({ description: ' one record fetched succesfully' })
  @Get('view-request')
  async viewRecord(@Query('id', ParseIntPipe) id: number) {
    const result = await this.nurseService.viewRequest(id);
    return new GenericResponse('one record fetched', result);
  }

  @ApiCreatedResponse({ description: ' Record sent to doctor' })
  @AllowRoles(ERoles.RECEPTIONIST, ERoles.NURSE)
  @ApiQuery({ name: 'id', type: Number })
  @Post('send-to-doc')
  async nurseTransferToDoc(@Query('id', ParseIntPipe) recordId: number) {
    const result = await this.nurseService.nurseSendToDoc(recordId);
    return new GenericResponse('Record sent to doctor', result);
  }
  @HttpCode(200)
  @ApiOkResponse({ description: ' Vitals updated Succesfully' })
  @Patch('update-vitals')
  async updateSignVitals(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: vitalsDto,
  ) {
    const result = await this.nurseService.updateSignVitals(id, dto);
    return new GenericResponse('Vitals updated Succesfully', result);
  }
}
