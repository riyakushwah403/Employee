import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { updateEmployeeDTO } from './DTO/updateEmployeeDto';
import * as bcrypt from 'bcrypt';
import { updateAddressDTO } from './DTO/addressDto';
import { AddressDto } from './DTO/addressDto';

@Injectable()
export class EmployeeService {
  constructor(private readonly databaseService: DatabaseService) {}

  // async createEmployee(employeeData: any): Promise<any> {
  //   console.log('create method call.........');
  //   const hashedPassword = await bcrypt.hash(employeeData.password, 10);
  //   console.log(hashedPassword);

  //   const sql =
  //     'INSERT INTO employee (first_name, last_name, address, email, phone_no, salary) VALUES (?, ?, ?, ?, ?, ?)';
  //   const values = [
  //     employeeData.first_name,
  //     employeeData.last_name,
  //     employeeData.address,
  //     employeeData.email,
  //     employeeData.phone_no,
  //     employeeData.salary,
  //     hashedPassword,
  //   ];

  //   try {
  //     const result = await this.databaseService.query(sql, values);
  //     return result;
  //   } catch (error) {
  //     if (error.code === 'ER_DUP_ENTRY') {
  //       throw new ConflictException('This email address is already in use.');
  //     }
  //     throw error;
  //   }
  // }

  async findAll(): Promise<any[]> {
    console.log('findAll method call');

    const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, employee.email, employee.phone_no,
    employee.salary,    address.street, address.city, address.pincode, address.state
  FROM employee
  LEFT JOIN address ON employee.id = address.employee_id
    WHERE employee.id = address.employee_id
    `;
    const results = await this.databaseService.query(sql);

    return results;
  }

  async findById(id: number): Promise<any> {
    console.log('findById method calling>>>>>>>>>>>>>');

    const sql = `
    SELECT employee.id, employee.first_name, employee.last_name, employee.email, employee.phone_no,
    employee.salary,  address.street, address.city, address.pincode, address.state
    FROM employee
    LEFT JOIN address ON employee.id = address.employee_id
    WHERE employee.id = ?
  `;

    const values = [id];

    const [results] = await this.databaseService.query(sql, values);

    if (!results) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return results;
  }

  async updateEmployee(id: number, employee: updateEmployeeDTO): Promise<void> {
    console.log('employee>>>>>>>>>>>>', employee);

    const existingEmployee = await this.findById(id);

    const {
      first_name = existingEmployee.first_name,
      last_name = existingEmployee.last_name,
      email = existingEmployee.email,
      phone_no = existingEmployee.phone_no,
      salary = existingEmployee.salary
    } = employee;

    const query = `
      UPDATE employee 
      SET first_name = ?, last_name = ?, email = ?, phone_no = ? , salary =?
      WHERE id = ?
    `;

    const params = [first_name, last_name, email, phone_no,salary, id];

    try {
      await this.databaseService.query(query, params);
    } catch (error) {
      throw error;
    }
  }

  
  async updateAddress(id: number, address: updateAddressDTO): Promise<void> {
    const existingAddress = await this.getAddressByEmployeeId(id);

    if (existingAddress) {
      const {
        street = existingAddress.street,
        city = existingAddress.city,
        state = existingAddress.state,
        pincode = existingAddress.pincode,
      } = address;

      console.log('Updating existing address:', existingAddress);

      const query = `
        UPDATE address 
        SET street = ?, city = ?, state = ?, pincode = ? 
        WHERE employee_id = ?
      `;
      const params = [street, city, state, pincode, id];

      try {
        console.log('Address update query:', query);
        console.log('Address update values:', params);
        await this.databaseService.query(query, params);
      } catch (error) {
        throw error;
      }
    } else {
      console.log('Inserting new address:', address);

      const insertQuery = `
        INSERT INTO address (employee_id, street, city, state, pincode)
        VALUES (?, ?, ?, ?, ?)
      `;
      const insertParams = [
        id,
        address.street,
        address.city,
        address.state,
        address.pincode,
      ];

      try {
        console.log('Address insert query:', insertQuery);
        console.log('Address insert values:', insertParams);
        await this.databaseService.query(insertQuery, insertParams);
      } catch (error) {
        throw error;
      }
    }
  }

 
  async deleteById(id: number): Promise<string> {
    const deleteAddressQuery = 'DELETE FROM address WHERE employee_id = ?';
    const deleteEmployeeQuery = 'DELETE FROM employee WHERE id = ?';
    const updateProjectQuery = 'UPDATE project SET employee_ids =  JSON_REMOVE(employee_ids, JSON_UNQUOTE(JSON_SEARCH(employee_ids, "one", ?))) WHERE JSON_SEARCH(employee_ids, "one", ?) IS NOT NULL';

  
    const values = [id];
  
    try {
      await this.databaseService.query(deleteAddressQuery, values);
  
      await this.databaseService.query(updateProjectQuery, [id, id]);
  
      const result = await this.databaseService.query(deleteEmployeeQuery, values);
  
      if (result.affectedRows === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
  
      return 'Employee and related data deleted successfully';
    } catch (error) {
      throw error;
    }
  }
  

  async getAddressByEmployeeId(employeeId: number): Promise<AddressDto> {
    const query = `
      SELECT street, city, state, pincode
      FROM address
      WHERE employee_id = ?
    `;
    const params = [employeeId];

    try {
      const [address] = await this.databaseService.query(query, params);
      return address;
    } catch (error) {
      throw error;
    }
  }
}
