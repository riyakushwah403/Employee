import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule, } from '@nestjs/jwt/dist';
import { JWTConfig } from 'src/config/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { EmployeeController } from 'src/employee/employee.controller';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
  imports:[DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => JWTConfig(configService), 
      inject: [ConfigService],}),
    ConfigModule.forRoot({ isGlobal: true }), ],
  controllers: [AuthController, EmployeeController],
  providers: [AuthService,EmployeeService]
})
export class AuthModule {}
