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
import { EmployeeInterFace } from './Interface/employeeInterface';
import { AddressDto, updateAddressDTO } from './DTO/addressDto';
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('')
  async findAll(): Promise<EmployeeInterFace[]> {
    console.log('get api call');

    return this.employeeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<EmployeeInterFace> {
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
    @Body()
    requestData: { employee: updateEmployeeDTO; address: updateAddressDTO },
  ): Promise<void> {
    const { employee, address } = requestData;
    try {
      await this.employeeService.updateEmployee(id, employee);
      await this.employeeService.updateAddress(id, address);
      const updatedEmployee = await this.employeeService.findById(id);
      return updatedEmployee;
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
