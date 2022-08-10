/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthAdminSignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, format: 'email', required: true })
  email: string;
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    format: 'password',
  })
  password: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    format: 'fullName',
  })
  fullNames: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    format: 'contact',
  })
  contact: string;
}

export class AuthAdminSignIn {
  @ApiProperty({ type: String, format: 'email', required: true })
  @IsString()
  email: string;
  @IsString()
  @ApiProperty({ type: String, format: 'password', required: true })
  password: string;
}

export class userSignInDto {
  @ApiProperty({ type: String, format: 'email', required: true })
  @IsString()
  email: string;
  @IsString()
  @ApiProperty({ type: String, format: 'password', required: true })
  password: string;
}

export class cartDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  id: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  pricePaid: number;
}
