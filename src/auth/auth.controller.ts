/* eslint-disable */
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GenericResponse } from '../__shared__/dto/generic-response.dto';
import { AuthService } from './auth.service';
import {
  AuthAdminSignIn,
  AuthAdminSignUpDto,
  userSignInDto,
} from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  //admin signUp
  @ApiCreatedResponse({ description: 'Admin created successfully' })
  @ApiConflictResponse({ description: 'Admin already exists' })
  @ApiBody({ type: AuthAdminSignUpDto })
  @Post('admin-signup')
  adminSignUp(@Body() dto: AuthAdminSignUpDto) {
    return this.authservice.adminSignUp(dto);
  }

  //admin login
  @ApiOkResponse({ description: 'Admin logged in successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden User' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ type: AuthAdminSignIn })
  @HttpCode(200)
  @Post('admin-login')
  async adminLogin(@Body() dto: AuthAdminSignIn) {
    const result = await this.authservice.adminLogin(dto);
    return new GenericResponse('Admin logged in successfully', result);
  }

  //user-login
  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden User' })
  @ApiForbiddenResponse({ description: 'Forbidden User' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ type: userSignInDto })
  @HttpCode(200)
  @Post('user-signin')
  async userLogin(@Body() dto: userSignInDto) {
    const result = await this.authservice.userLogin(dto);
    return new GenericResponse('User logged in successfully', result);
  }
}
