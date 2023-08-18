import {
  IsEmail,
  IsNumberString,
  IsString,
  Matches,
  IsOptional,
} from 'class-validator';

export class updateEmployeeDTO {
  id: number;

  @IsOptional()
  first_name: string;

  @IsOptional()
  last_name: string;

  @IsOptional()
  address: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/)
  phone_no: string;

  @IsOptional()
  @IsNumberString()
  salary: string;
}
