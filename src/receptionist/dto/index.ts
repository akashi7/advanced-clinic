/* eslint-disable */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { cartDto } from 'src/auth/dto/auth.dto';

export class registerPatientDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  fullName: string;
  @IsString()
  @ApiProperty({ type: String, required: true })
  phone: string;
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

export class searchField {
  @IsNotEmpty()
  field: any;
}

export class RecordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  rate: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  itemId: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  doctor: number;
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  nurse: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  insuranceId: number;
  amountToBePaid: number;
  amountPaid: number;
  unpaidAmount: number;
  amountPaidByInsurance: number;
}

export class FilterPatients {
  @IsString()
  @ApiProperty({ type: String, required: true })
  fullName: string;

  @IsString()
  @ApiProperty({ type: String, required: true })
  idNumber: string;
}

export class MakePaymentDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true, required: true, type: cartDto })
  cart: cartDto[];
}

export class FilterRecordDto {
  @IsString()
  @IsOptional()
  @Matches(/^(\d{4})-(\d{2})-(\d{2})$/)
  @ApiPropertyOptional({ type: String })
  recordDate: string;
}
