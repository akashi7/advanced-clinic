/* eslint-disable */
import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
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
    return result;
  }

  //user-login
  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden User' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ type: userSignInDto })
  @HttpCode(200)
  @Post('user-signin')
  async userLogin(@Body() dto: userSignInDto) {
    const result = await this.authservice.userLogin(dto);
    return result;
  }

  @ApiCreatedResponse({ description: 'Changed Role successfully ' })
  @ApiQuery({ name: 'email', required: true })
  @ApiQuery({ name: 'role', required: true })
  @Post('choose-role')
  async userChooseRole(
    @Query('email') email: string,
    @Query('role') role: string,
  ) {
    const result = await this.authservice.userChooseRole(email, role);
    return result;
  }
}
