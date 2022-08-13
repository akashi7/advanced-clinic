/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExamCreationDto } from 'src/auth/dto/auth.dto';

export class examDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true })
  laborante: number;
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true, required: true, type: ExamCreationDto })
  exams: ExamCreationDto[];
}

export class FilterResult {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: Boolean })
  results: boolean;
}
