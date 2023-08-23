import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { clientDto } from './clientDto';
import { Type } from 'class-transformer';

export class ProjectDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @IsDateString()
  @IsOptional()
  end_date: Date;

  @IsString()
  @IsOptional()
  status: string;

  
  @ValidateNested() 
  @Type(() => clientDto)
  client: clientDto;

}


export class updateProjectDto {

 @IsOptional()
    @IsString()
    @MinLength(4)
    name: string;
  
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    description: string;
  
    @IsDateString()
    @IsOptional()
    @IsNotEmpty()
    start_date: Date;
  
    @IsDateString()
    @IsOptional()
    @IsOptional()
    end_date: Date;
  
    @IsString()
    @IsOptional()
    status: string;
  
    @IsString()
    @IsOptional()
    client: string;
  }
