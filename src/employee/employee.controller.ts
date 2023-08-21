import {
  Controller,
  Get,
  Body,
  Param,
  NotFoundException,
  Delete,
  Patch,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { updateEmployeeDTO } from './DTO/updateEmployeeDto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('')
  async findAll(): Promise<any[]> {
    console.log('get api call');

    return this.employeeService.findAll();
  }
  @Get(':id')
  async findById(@Param('id') id: number): Promise<any> {
    console.log('findOne call>>>>>>>>>');

    try {
      return await this.employeeService.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('An error occurred while fetching user');
    }
  }
  @Patch(':id')
  async updateEmployeeById(
    @Param('id') id: number,
    @Body() employeeData: updateEmployeeDTO,
  ): Promise<any> {
    try {
      return await this.employeeService.updateById(id, employeeData);
    } catch (error) {
      console.error(error); 
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('An error occurred while updating employee');
    }
  }

  @Delete(':id')
  async deleteEmployeeById(@Param('id') id: number): Promise<string> {
    console.log('delete api>>>>>>>>>');

    try {
      return await this.employeeService.deleteById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('An error occurred while deleting user');
    }
  }
}
