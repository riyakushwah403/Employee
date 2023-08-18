import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { updateEmployeeDTO } from './DTO/updateEmployeeDto';

@Injectable()
export class EmployeeService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createEmployee(employeeData: any): Promise<any> {
    console.log('create method call.........');

    const sql =
      'INSERT INTO employee (first_name, last_name, address, email, phone_no, salary) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [
      employeeData.first_name,
      employeeData.last_name,
      employeeData.address,
      employeeData.email,
      employeeData.phone_no,
      employeeData.salary,
    ];

    try {
      const result = await this.databaseService.query(sql, values);
      return result;
    } catch (error) {
     
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('This email address is already in use.');
      }
      throw error; 
    }
  }

  async findAll(): Promise<any[]> {
    console.log('findall method call');

    const sql = 'SELECT * FROM employee';
    const results = await this.databaseService.query(sql);
    return results;
  }
  async findById(id: number): Promise<any> {
    console.log('findByID method calling>>>>>>>>>>>>>');

    const sql = 'SELECT * FROM employee WHERE id = ?';
    const values = [id];
    const [results] = await this.databaseService.query(sql, values);

    if (!results) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return results;
  }
  async updateById(
    id: number,
    updateEmployeeDTO: updateEmployeeDTO,
  ): Promise<any> {
    const { first_name, last_name, address, email, phone_no, salary } =
      updateEmployeeDTO;
console.log("update method call>>>>>>>>>>>>>>");

    const updateFields = [];
    const values = [];

    if (first_name !== undefined) {
      updateFields.push('first_name = ?');
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updateFields.push('last_name = ?');
      values.push(last_name);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      values.push(address);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      values.push(email);
    }
    if (phone_no !== undefined) {
      updateFields.push('phone_no = ?');
      values.push(phone_no);
    }
    if (salary !== undefined) {
      updateFields.push('salary = ?');
      values.push(salary);
    }

    if (updateFields.length === 0) {
      throw new BadRequestException('No valid fields to update');
    }
    const updateQuery = `
    UPDATE employee
    SET ${updateFields.join(', ')}
    WHERE id = ?;
  `;

    values.push(id);

    try {
      const updatedEmployee = await this.databaseService.query(
        updateQuery,
        values,
      );

      if (updatedEmployee.affectedRows === 0) {
        throw new NotFoundException('Employee not found');
      }
      return updatedEmployee;
    } catch (error) {
      throw new Error(
        'An error occurred while updating employee: ' + error.message,
      );
    }
  }
  async deleteById(id: number): Promise<string> {
    const sql = 'DELETE FROM employee WHERE id = ?';
    const values = [id];
    const result = await this.databaseService.query(sql, values);

    if (result.affectedRows === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return 'Employee deleted successfully';
  }
}
