import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
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
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'User profile' })
  @ApiUnauthorizedResponse({ description: 'Unthorized' })
  @ApiBadRequestResponse({ description: 'Server down' })
  @Get('user-profile')
  UserProfile(@GetUser() user: User) {
    return this.userService.userProfile(user);
  }

  @ApiOkResponse({ description: 'Password updated' })
  @ApiUnauthorizedResponse({ description: 'Unthorized' })
  @ApiBadRequestResponse({ description: 'Server down' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiForbiddenResponse({
    description: 'Wrong password or passwords do not match',
  })
  @HttpCode(200)
  @Patch('update-password')
  UpdatePassword(@GetUser() user: User, @Body() dto: UpdatePasswordDto) {
    return this.userService.updateUserPassword(user, dto);
  }
}
