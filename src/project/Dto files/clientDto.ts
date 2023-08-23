import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class clientDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: Date;

  
  @IsString()

  phone: string;

  @IsString()
  country: string;
  // @ValidateNested()
  // @Type(() => AddressDto)
  // address: AddressDto;
}
