/* eslint-disable */
import {
  Body,
  Controller,
  Delete,
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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
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
import { ClinicService } from './clinic.service';
import {
  InsuranceDto,
  insuranceUpdateDto,
  ItemDto,
  itemUpdateDto,
  registerEmployee,
  UpdatePasswordDto,
} from './dto/clinic.dto';

@Controller('clinic')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.CLINIC)
@ApiBearerAuth()
@ApiTags('clinic')
export class ClinicController {
  constructor(private readonly clinic: ClinicService) {}

  @Post('register-user')
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBody({ type: registerEmployee })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  RegisterUser(@Body() dto: registerEmployee, @GetUser() clinic: User) {
    return this.clinic.RegisterUser(dto, clinic);
  }

  @Patch('update-clinic')
  @ApiCreatedResponse({ description: 'Clinic password reset successfully' })
  @ApiConflictResponse({ description: 'Clinic password reset failed' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBody({ type: UpdatePasswordDto })
  UpdatePassword(@Body() dto: UpdatePasswordDto, @GetUser() user: User) {
    return this.clinic.updatePassword(dto, user);
  }

  @ApiCreatedResponse({ description: 'Insurance created successfully' })
  @ApiConflictResponse({ description: 'Insurance already exists' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: InsuranceDto })
  @Post('register-insurance')
  RegisterInsurance(@Body() dto: InsuranceDto, @GetUser() user: User) {
    return this.clinic.registerInsurance(dto, user);
  }

  @ApiCreatedResponse({ description: 'Item created successfully' })
  @ApiConflictResponse({ description: 'Item already exists' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: ItemDto })
  @Post('register-item')
  RegisterItem(@Body() dto: ItemDto, @GetUser() user: User) {
    return this.clinic.registerClinicItems(dto, user);
  }

  @ApiOkResponse({ description: 'Insurance updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @ApiBody({ type: insuranceUpdateDto })
  @HttpCode(200)
  @Patch('update-insurance')
  UpdateInsurance(
    @Body() dto: insuranceUpdateDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.clinic.updateInsurance(id, dto);
  }

  @ApiOkResponse({ description: 'Insurance removed successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  @Delete('delete-insurance')
  DeleteInsurance(@Query('id', ParseIntPipe) id: number) {
    return this.clinic.deleteInsurance(id);
  }

  @ApiOkResponse({ description: 'Item updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: itemUpdateDto })
  @ApiQuery({ name: 'id', type: Number })
  @HttpCode(200)
  @Patch('update-item')
  UpdateItem(
    @Body() dto: itemUpdateDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.clinic.updateItem(dto, id);
  }

  @Delete('delete-item')
  @ApiOkResponse({ description: 'Item removed successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', type: Number })
  DeleteItem(@Query('id', ParseIntPipe) id: number) {
    return this.clinic.deleteItem(id);
  }
}
