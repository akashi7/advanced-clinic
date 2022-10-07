/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExamCreationDto } from 'src/auth/dto/auth.dto';

export class examDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true, required: true, type: ExamCreationDto })
  exams: ExamCreationDto[];
}

export class FilterResult {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: Boolean })
  results: boolean;
}
export class ObservationDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true, required: true, type: Array })
  medecines: string[];
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true, required: true, type: Array })
  disease: string[];
}

export class AppointmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  reason: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  Date: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  serviceId: number;
  @IsArray()
  @ApiProperty({ isArray: true, required: false, type: Array })
  medecines: string[];
  @IsArray()
  @ApiProperty({ isArray: true, required: false, type: Array })
  disease: string[];
}

export class FilterAppointments {
  @IsString()
  @ApiProperty({ type: String, required: false })
  date: string;
}
