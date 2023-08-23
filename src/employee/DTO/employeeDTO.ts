
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './addressDto';
export class EmployeeDTO {
  id: number;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  first_name: string;

  @IsNotEmpty()
  @MinLength(3)
  last_name: string;

  @ValidateNested() 
  @Type(() => AddressDto)
  address: AddressDto;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\d{10}$/)
  phone_no: string;

  @IsNumberString()
  salary: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/)
  password: string;
}


