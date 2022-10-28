/* eslint-disable */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  clicnicCode: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  contactEmail: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  contactPhone: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  contactName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  contactTitle: string;
}

export class registerEmployee {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  fullName: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String, format: 'email' })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  role: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  gender: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  phone: string;
  @IsArray()
  @ApiProperty({ isArray: true, required: false, type: Array })
  assignedRoles: string[];
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

export class insuranceUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: Number })
  rate: number;
}

export class consultationDto {
  @IsString()
  @ApiProperty({ required: true, type: String })
  type: string;
  @IsString()
  @ApiProperty({ required: true, type: String })
  description: string;
  @IsString()
  @ApiProperty({ required: true, type: String })
  consultation: string;
}

export class ExamDto {
  @IsString()
  @ApiProperty({ required: true, type: String })
  Name: string;
  @IsString()
  @ApiProperty({ required: true, type: String })
  Code: string;
  @IsString()
  @ApiProperty({ required: true, type: String })
  description: string;
}

export class PriceListDto {
  @IsNumber()
  @ApiProperty({ required: true, type: Number })
  itemId: number;
  @IsNumber()
  @ApiProperty({ required: true, type: Number })
  price: number;
  @IsNumber()
  @ApiProperty({ required: true, type: Number })
  insuranceId: number;
  @IsString()
  @ApiProperty({ required: true, type: String })
  type: string;
}

export class UpdatePriceListDto {
  @IsNumber()
  @ApiProperty({ required: true, type: Number })
  price: number;
}

export class FilterReportDto {
  @IsNumber()
  month: number;
  @IsNumber()
  year: number;
}

export class AsignRoleDto {
  @IsArray()
  @ApiProperty({ isArray: true, required: true, type: Array })
  roles: any[];
}

export class createStockDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  item: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  expirationDate: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  quantity: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  category: string;
}

export class filterclinicReports {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String, required: false })
  case: string;
  @IsString()
  @ApiPropertyOptional({ type: String, required: false })
  disease: string;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number, required: false })
  age: number;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String, required: false })
  startDate: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String, required: false })
  endDate: string;
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ type: Boolean, required: false })
  horZone: boolean;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String, required: false })
  service: string;
}
