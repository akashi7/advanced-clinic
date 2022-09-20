/*eslint-disable*/
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  firstAid: string;
  @IsArray()
  @ApiProperty({ isArray: true, required: true, type: Array })
  diseases: string[];
  @IsArray()
  @ApiProperty({ isArray: true, required: true, type: Array })
  symptoms: string[];
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
