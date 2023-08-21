import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { AuthDTO } from 'src/employee/DTO/authDTO';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from 'src/employee/employee.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}

  async createEmployee(employeeData: any): Promise<any> {
    console.log('create method call.........');
    const hashedPassword = await bcrypt.hash(employeeData.password, 10);
    console.log(hashedPassword);

    const sql =
      'INSERT INTO employee (first_name, last_name, address, email, phone_no, salary,password) VALUES (?, ?, ?,?, ?, ?, ?)';
    const values = [
      employeeData.first_name,
      employeeData.last_name,
      employeeData.address,
      employeeData.email,
      employeeData.phone_no,
      employeeData.salary,
      hashedPassword,
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
  async signIn(LoginDTO: AuthDTO): Promise<any> {
    const { email, password } = LoginDTO;

    const query = 'SELECT * FROM employee WHERE email = ?';
    const user = await this.databaseService.query(query, [email]);

    if (!user || user.length === 0) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (!passwordMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    console.log(currentTime);

    const expirationTime = currentTime + 2 * 60 * 60;

    const payload = {
      sub: user[0].id,
      email: user[0].email,
      exp: expirationTime,
    };

    const AccessToken = this.jwtService.sign(payload);
    console.log('token>>>>>>>>>>>>>>>>>>>>>>>>>', AccessToken);

    return { user: user[0], AccessToken };
  }
}
