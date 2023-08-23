import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthMiddleware } from 'src/auth/middleware/AuthMiddleware';
import { JWTConfig } from 'src/config/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JwtModule, } from '@nestjs/jwt/dist';

@Module({
  imports:[DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => JWTConfig(configService), 
      inject: [ConfigService],}),
    ConfigModule.forRoot({ isGlobal: true })],
  controllers: [EmployeeController],
  providers: [EmployeeService]
})
export class EmployeeModule  implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .forRoutes(EmployeeController)
  }
}
