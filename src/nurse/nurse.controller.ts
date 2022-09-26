import {
  Body,
  Controller,
  Get,
  // HttpCode,
  ParseIntPipe,
  // Patch,
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
import { medicalHistoryDto } from './dto';
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

  @ApiOkResponse({ description: ' one record fetched succesfully' })
  @Get('view-request')
  async viewRecord(@Query('id', ParseIntPipe) id: number) {
    const result = await this.nurseService.viewRequest(id);
    return new GenericResponse('one record fetched', result);
  }

  @ApiCreatedResponse({ description: ' Record sent to doctor' })
  @ApiQuery({ name: 'recordId', type: Number })
  @ApiQuery({ name: 'doctorId', type: Number })
  @Post('send-to-doc')
  async nurseTransferToDoc(
    @Query('recordId', ParseIntPipe) recordId: number,
    @Query('id', ParseIntPipe) doctorId: number,
  ) {
    const result = await this.nurseService.nurseSendToDoc(recordId, doctorId);
    return new GenericResponse('Record sent to doctor', result);
  }
  // @HttpCode(200)
  // @ApiOkResponse({ description: ' Vitals updated Succesfully' })
  // @Patch('update-vitals')
  // async updateSignVitals(
  //   @Query('id', ParseIntPipe) id: number,
  //   @Body() dto: vitalsDto,
  // ) {
  //   const result = await this.nurseService.updateSignVitals(id, dto);
  //   return new GenericResponse('Vitals updated Succesfully', result);
  // }
  // @ApiCreatedResponse({ description: 'Consultation success' })
  // @ApiQuery({ name: 'recordId', type: Number })
  // @ApiBadRequestResponse({ description: 'consultation not in priceList' })
  // @Post('recommend-consultation')
  // async RecommendCons(
  //   @Body('') dto: ReommendConsultationDto,
  //   @Query('recordId', ParseIntPipe) recordId: number,
  //   @GetUser() user: User,
  // ) {
  //   const result = await this.nurseService.recomendConsultation(
  //     dto,
  //     user,
  //     recordId,
  //   );
  //   return new GenericResponse('Consultation success', result);
  // }

  @ApiCreatedResponse({ description: 'medical info success' })
  @ApiQuery({ name: 'recordId', type: Number })
  @ApiBody({ type: medicalHistoryDto })
  @Post('register-m-info')
  async RegisterMedicalInfo(
    @Body('') dto: medicalHistoryDto,
    @Query('recordId', ParseIntPipe) recordId: number,
    @GetUser() user: User,
  ) {
    const result = await this.nurseService.nurseRgisterMedicalInformation(
      recordId,
      dto,
      user,
    );
    return new GenericResponse('registered success', result);
  }
  @ApiOkResponse({ description: 'Doctors ' })
  @Get('all-doctors')
  async getAllDoctors(@GetUser() user: User) {
    const result = await this.nurseService.allDoctors(user);
    return new GenericResponse('All doctors fetched successfully', result);
  }
}
