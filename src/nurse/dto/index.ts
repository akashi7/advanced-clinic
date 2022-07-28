/*eslint-disable*/
import { IsNotEmpty, IsString } from 'class-validator';

export class vitalsDto {
  @IsString()
  @IsNotEmpty()
  weight: string;
  @IsString()
  @IsNotEmpty()
  height: string;
  @IsString()
  @IsNotEmpty()
  temperature: string;
  @IsString()
  @IsNotEmpty()
  BP: string;
  @IsString()
  @IsNotEmpty()
  pulse: string;
}
