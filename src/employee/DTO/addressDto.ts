import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MinLength,
  IsOptional,
} from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  pincode: number;

  @IsString()
  @MinLength(3)
  city: string;

  @IsString()
  state: string;
}

export class updateAddressDTO {
  @IsString()
  @IsOptional()
  street: string;

  @IsOptional()
  @IsNumber()
  pincode: number;

  @IsString()
  @IsOptional()
  @MinLength(3)
  city: string;

  @IsOptional()
  @IsString()
  state: string;
}
