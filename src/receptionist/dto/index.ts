/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class registerPatientDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  address: string;
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  contact: any;
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsString()
  @ApiProperty({ type: String, required: true })
  DOB: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  gender: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  province: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  district: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  sector: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  village: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  marital_status: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  closeFullName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  closePhone: string;
}

export class RecordDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  insurance: string;
}

export class searchField {
  @IsNotEmpty()
  field: any;
}
