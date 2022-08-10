/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { ExamConductDto } from 'src/auth/dto/auth.dto';

export class conductExamDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true, required: true, type: ExamConductDto })
  exams: ExamConductDto[];
}
