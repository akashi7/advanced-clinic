/* eslint-disable */
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class registerPatientDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  contact: any;
  @IsString()
  @IsString()
  DOB: string;
  @IsString()
  @IsNotEmpty()
  gender: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
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
  village: string;
  @IsString()
  @IsNotEmpty()
  marital_status: string;
  @IsString()
  @IsNotEmpty()
  closeFullName: string;
  @IsString()
  @IsNotEmpty()
  closePhone: string;
}

export class RecordDto {
  @IsString()
  @IsNotEmpty()
  consultation: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class searchField {
  @IsNotEmpty()
  field: any;
}
