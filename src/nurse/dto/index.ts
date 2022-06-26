/*eslint-disable*/
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class vitalsDto {
  @IsString()
  @IsNotEmpty()
  weight: string;
  @IsString()
  @IsNotEmpty()
  height: string;
  @IsBoolean()
  @IsNotEmpty()
  hasInsurance: boolean;
  @IsString()
  @IsNotEmpty()
  insurance: string;
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
