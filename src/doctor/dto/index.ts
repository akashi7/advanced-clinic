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
}
