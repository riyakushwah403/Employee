import { Module, NestMiddleware, NestModule } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { JWTConfig } from 'src/config/jwt';
import { MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from 'src/auth/middleware/AuthMiddleware';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
  imports:[DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => JWTConfig(configService), 
      inject: [ConfigService],}),
    ConfigModule.forRoot({ isGlobal: true })],
 
  controllers: [ProjectController],
  providers: [ProjectService, EmployeeService]
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .forRoutes(ProjectController)
  }
}
