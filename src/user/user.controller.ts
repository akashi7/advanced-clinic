import { Controller, Get, HttpCode, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
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
@AllowRoles(
  ERoles.CLINIC,
  ERoles.DOCTOR,
  ERoles.LABORANTE,
  ERoles.NURSE,
  ERoles.RECEPTIONIST,
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
  @HttpCode(200)
  @Patch('update-password')
  UpdatePassword(@GetUser() user: User, dto: UpdatePasswordDto) {
    return this.userService.updateUserPassword(user, dto);
  }
}
