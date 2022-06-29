/* eslint-disable */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ClinicDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  @IsNotEmpty()
  contact: string;
  @IsString()
  @IsNotEmpty()
  province: string;
  @IsString()
  @IsNotEmpty()
  district: string;
  @IsString()
  @IsNotEmpty()
  sector: string;
  @IsNotEmpty()
  @IsString()
  cell: string;
  @IsString()
  @IsNotEmpty()
  village: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class registerEmployee {
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsString()
  @IsNotEmpty()
  contact: string;
  @IsString()
  @IsNotEmpty()
  province: string;
  @IsString()
  @IsNotEmpty()
  district: string;
  @IsString()
  @IsNotEmpty()
  sector: string;
  @IsString()
  @IsNotEmpty()
  cell: string;
  @IsString()
  @IsNotEmpty()
  village: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  role: string;
}

export class clinicSignDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
