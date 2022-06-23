/* eslint-disable */
import { Body, Controller, Post } from '@nestjs/common';
import { clinicSignDto } from 'src/clinic/dto/clinic.dto';
import { AuthService } from './auth.service';
import {
  AuthAdminSignIn,
  AuthAdminSignUpDto,
  userSignInDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  //admin signUp

  @Post('admin-signup')
  adminSignUp(@Body() dto: AuthAdminSignUpDto) {
    return this.authservice.adminSignUp(dto);
  }

  //admin login

  @Post('admin-login')
  adminLogin(@Body() dto: AuthAdminSignIn) {
    return this.authservice.adminLogin(dto);
  }

  //user-login

  @Post('user-signin')
  userLogin(@Body() dto: userSignInDto) {
    return this.authservice.userLogin(dto);
  }

  //clinic signIn

  @Post('clinic-signin')
  clinicLogin(@Body() dto: clinicSignDto) {
    return this.authservice.clinicLogin(dto);
  }
}
