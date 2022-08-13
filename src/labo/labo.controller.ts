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
import { conductExamDto } from './dto';
import { LaboService } from './labo.service';

@Controller('labo')
@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('laborante')
@AllowRoles(ERoles.LABORANTE)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class LaboController {
  constructor(private readonly laboService: LaboService) {}

  @ApiOkResponse({ description: 'Labo requests' })
  @Get('see-requests')
  async laboSeeAllRequets(@GetUser() user: User) {
    const result = await this.laboService.laboSeeAllRequets(user);
    return new GenericResponse('laborante requests', result);
  }
  @ApiOkResponse({ description: 'Labo one request' })
  @ApiQuery({ name: 'recordDetailsId', required: true })
  @Get('see-one-request')
  async laboViewRequet(@Query('recordDetailsId', ParseIntPipe) id: number) {
    const result = await this.laboService.laboViewRequet(id);
    return new GenericResponse('laborante one request', result);
  }

  @ApiOkResponse({ description: 'Labo requests' })
  @HttpCode(200)
  @ApiBody({ type: conductExamDto })
  @Patch('mark-exams')
  async markExams(@Body() dto: conductExamDto) {
    const result = await this.laboService.markExams(dto);
    return new GenericResponse('marked exams', result);
  }

  @ApiCreatedResponse({ description: 'record sent to doctor' })
  @ApiQuery({ name: 'recordId', required: true })
  @Post('send-to-doc')
  async sendToDoctor(@Query('recordId', ParseIntPipe) id: number) {
    const result = await this.laboService.sendToDoctor(id);
    return new GenericResponse('record sent to doctor', result);
  }
}
