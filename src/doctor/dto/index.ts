/* eslint-disable */
import { IsNotEmpty, IsString } from 'class-validator';

export class examDto {
  @IsString()
  @IsNotEmpty()
  exams: string;
}
