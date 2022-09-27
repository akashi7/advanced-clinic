/*eslint-disable*/
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class cashierDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  patientCode: string;
  @IsString()
  @ApiProperty({ type: String, required: false, default: '' })
  date: string;
}
