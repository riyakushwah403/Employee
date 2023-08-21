import { IsEmail, IsString, Matches } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/)
  password: string;
}
