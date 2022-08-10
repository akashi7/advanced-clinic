import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
  @Get('see-one-request')
  async laboViewRequet(@Query('recordDetailsId', ParseIntPipe) id: number) {
    const result = await this.laboService.laboViewRequet(id);
    return new GenericResponse('laborante one request', result);
  }

  @ApiOkResponse({ description: 'Labo requests' })
  @HttpCode(200)
  @Patch('mark-exams')
  async markExams(@Body() dto: conductExamDto) {
    const result = await this.laboService.markExams(dto);
    return new GenericResponse('marked exams', result);
  }
}
