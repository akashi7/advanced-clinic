/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ClinicDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  address: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  contact: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  province: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  district: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  sector: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, type: String })
  cell: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  village: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String, format: 'email' })
  email: string;
}

export class registerEmployee {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  fullName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  address: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  contact: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  province: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  district: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  sector: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  cell: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  village: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String, format: 'email' })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  role: string;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  confirmPassword: string;
}
