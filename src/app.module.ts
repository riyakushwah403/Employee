import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [EmployeeModule, DatabaseModule, AuthModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
