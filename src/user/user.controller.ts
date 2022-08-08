import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
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
import { UpdatePasswordDto } from 'src/clinic/dto/clinic.dto';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@AllowRoles(
  ERoles.RECEPTIONIST,
  ERoles.NURSE,
  ERoles.DOCTOR,
  ERoles.LABORANTE,
  ERoles.CLINIC,
)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'User profile' })
  @Get('user-profile')
  async UserProfile(@GetUser() user: User) {
    const result = await this.userService.userProfile(user);
    return new GenericResponse('User profile', result);
  }

  @ApiOkResponse({ description: 'Password updated' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiForbiddenResponse({
    description: 'Wrong password or passwords do not match',
  })
  @HttpCode(200)
  @Patch('update-password')
  async UpdatePassword(@GetUser() user: User, @Body() dto: UpdatePasswordDto) {
    const result = await this.userService.updateUserPassword(user, dto);
    return new GenericResponse('Password updated', result);
  }
}
