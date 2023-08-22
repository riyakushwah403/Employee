import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthDTO } from './DtoFiles/authDTO';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from 'src/employee/employee.service';
import { Encrypt } from './util/encrypt';
import { CustomResponse } from 'src/response/successResponse';
@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}

  async createEmployee(employeeData: any): Promise<any> {
    console.log('create method call.........');
    const encryptInstance = new Encrypt();
    const hashedPassword = await encryptInstance.encryptPassword(
      employeeData.password,
    );
    console.log(employeeData.password);

    console.log(hashedPassword);

    const sql = `
        INSERT INTO employee (first_name, last_name, email, phone_no, salary, password) VALUES (?, ?, ?, ?, ?, ?)
      `;
    const employeeParams = [
      employeeData.first_name,
      employeeData.last_name,
      employeeData.email,
      employeeData.phone_no,
      employeeData.salary,
      hashedPassword,
    ];

    try {
      const employeeResult = await this.databaseService.query(
        sql,
        employeeParams,
      );
      console.log(employeeResult);
      if (employeeResult.insertId) {
        const employeeId = employeeResult.insertId;

        const addressSql = `
    INSERT INTO address (employee_id, street, city, pincode, state) VALUES (?, ?, ?, ?, ?)
    `;
        const addressParams = [
          employeeId,
          employeeData.street,
          employeeData.city,
          employeeData.pincode,
          employeeData.state,
        ];
        const addressResult = await this.databaseService.query(
          addressSql,
          addressParams,
        );
        console.log(addressResult);
      }
      return new CustomResponse(HttpStatus.CREATED, 'Employee created successfully');
    } 
    catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(HttpStatus.CONFLICT, 'This email address is already in use');;
      }
      throw error;
    }
  }
  async signIn(loginDTO: AuthDTO): Promise<any> {
    const { email, password } = loginDTO;
    const encryptInstance = new Encrypt();
    const query = 'SELECT * FROM employee WHERE email = ?';
    const user = await this.databaseService.query(query, [email]);

    if (!user || user.length === 0) {
      throw new HttpException(
        new CustomResponse(HttpStatus.NOT_FOUND, 'Invalid username/password'),
        HttpStatus.NOT_FOUND,
      );
      
    }

    const passwordMatch = await encryptInstance.decryptPassword(
      password,
      user[0].password,
    );
    console.log(passwordMatch);

    if (!passwordMatch) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.NOT_FOUND,
      );
    }

    const currentTime = Math.floor(Date.now() / 1000);
    console.log(currentTime);

    const expirationTime = currentTime + 2 * 60 * 60;

    const payload = {
      sub: user[0].id,
      email: user[0].email,
      exp: expirationTime,
    };

    const accessToken = this.jwtService.sign(payload);
    console.log('token>>>>>>>>>>>>>>>>>>>>>>>>>', accessToken);

    return new CustomResponse(HttpStatus.OK, 'Login successful', {
      user: user[0],
      accessToken: accessToken,
    });
  }

}