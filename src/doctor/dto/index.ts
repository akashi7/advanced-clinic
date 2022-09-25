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
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  observation: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  disease: string;
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
  @ApiProperty({ type: String, required: true })
  serviceId: number;
}

export class FilterAppointments {
  @IsString()
  @ApiProperty({ type: String, required: false })
  date: string;
}
