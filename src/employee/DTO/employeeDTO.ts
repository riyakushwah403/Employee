// employee.dto.ts

import { IsNotEmpty, IsEmail, IsPhoneNumber, IsNumberString, isString, IsString, Matches } from 'class-validator';

export class EmployeeDTO {
  id: number;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  address: string;

  @IsEmail()
  email: string;

 @IsString()
@Matches(/^\d{10}$/)
  phone_no: string;

  @IsNumberString() 
  salary: string;
}
