import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumberString,
  IsString,
  Matches,
  IsOptional,
  IsNotEmpty,
  MinLength,
  IsNumber,
  ValidateNested,

} from 'class-validator';
import { AddressDto, updateAddressDTO } from './addressDto';
export class updateEmployeeDTO {
  id: number;

  @IsOptional()
  first_name: string;

  @IsOptional()
  last_name: string;

 
  @ValidateNested() 
  @Type(() => updateAddressDTO)
  addressData: updateAddressDTO;

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

  
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/)
  password: string;
}

