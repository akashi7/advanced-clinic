/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

export class InsuranceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  name: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: Number })
  rate: number;
}
export class ItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  itemName: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: Number })
  priceTag: number;
}

export class insuranceUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: Number })
  rate: number;
}

export class itemUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: Number })
  priceTag: number;
}
