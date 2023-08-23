import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ProjectDto {
  @IsString()
  @MinLength(4)
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
  status: string;

  @IsString()
  client: string;
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
