/* eslint-disable */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthAdminSignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  fullNames: string;
  @IsString()
  @IsNotEmpty()
  contact: string;
}

export class AuthAdminSignIn {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class userSignInDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
