/*eslint-disable*/
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class vitalsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  weight: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  height: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  temperature: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  BP: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  pulse: string;
}

export class medicalHistoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  observation: string;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true, required: true, type: Array })
  firstAid: string[];
  @IsArray()
  @ApiProperty({ isArray: true, required: true, type: Array })
  diseases: string[];
  @IsArray()
  @ApiProperty({ isArray: true, required: true, type: Array })
  symptoms: string[];
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  weight: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  height: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  temperature: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  BP: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  pulse: string;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ type: Boolean, required: true })
  medications: boolean;
  @IsArray()
  @ApiProperty({ isArray: true, required: false, type: Array })
  medicationType: string[];
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  HowLong: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  case: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  itemId: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  doctorId: number;
}

export class ReommendConsultationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  itemId: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  insuranceId: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  rate: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  doctorId: number;
}
