import { Controller, Post, Body } from '@nestjs/common';
import { EmployeeDTO } from 'src/employee/DTO/employeeDTO';
import { AuthDTO } from './DtoFiles/authDTO';
import { AuthService } from './auth.service';
import { EmployeeInterFace } from 'src/employee/Interface/employeeInterface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('add')
  async createEmployee(@Body() employeeData: EmployeeDTO): Promise<EmployeeInterFace> {
    console.log('post api call>>>>>>>>>>>>>');

    return this.authService.createEmployee(employeeData);
  }
  @Post('login')
  async logInEmployee(@Body() authData: AuthDTO): Promise<Object> {
    console.log('log in>>>>>>>>>>>>');
    return this.authService.signIn(authData);
  }
}
