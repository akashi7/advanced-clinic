/* eslint-disable */
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthAdminSignIn,
  AuthAdminSignUpDto,
  userSignInDto,
} from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
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
  adminLogin(@Body() dto: AuthAdminSignIn) {
    return this.authservice.adminLogin(dto);
  }

  //user-login
  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden User' })
  @ApiForbiddenResponse({ description: 'Forbidden User' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ type: userSignInDto })
  @HttpCode(200)
  @Post('user-signin')
  userLogin(@Body() dto: userSignInDto) {
    return this.authservice.userLogin(dto);
  }
}
