/*eslint-disable*/
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
