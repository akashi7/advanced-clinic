/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class registerPatientDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  phone: number;
  @ApiProperty({ type: String, required: true })
  @IsString()
  @ApiProperty({ type: String, required: true })
  DOB: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  gender: string;
  @IsString()
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
  @ApiProperty({ type: String, required: true })
  marital_status: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  GuardianNames: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  GuardianPhone: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  idNumber: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  MotherName: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  MotherPhone: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  FatherName: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  FatherPhone: string;
  @IsBoolean()
  @ApiProperty({ type: Boolean, required: true })
  isInfant: boolean;
  @IsString()
  @ApiProperty({ type: String, required: true })
  GuardianIdNumber: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  MotherIdnumber: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  FatherIdNumber: string;
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
