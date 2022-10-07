/*eslint-disable*/
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class cashierDto {
  @IsString()
  @ApiProperty({ type: String, required: false, default: '' })
  date: string;
}
