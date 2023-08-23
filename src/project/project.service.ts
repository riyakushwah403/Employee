import {
  Injectable,
  NotFoundException,
  Param,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CustomResponse } from 'src/response/successResponse';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ProjectDto, updateProjectDto } from './Dto files/projectDto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly employeeService: EmployeeService,
  ) {}

  // async createProjects(projectData: ProjectDto): Promise<CustomResponse> {
  //   const existingProject = await this.getProjectByName(projectData.name);
  //   if (existingProject) {
  //     throw new ConflictException(
  //       `Project with name '${projectData.name}' already exists`,
  //     );
  //   }

  //   const sql = `
  //     INSERT INTO project (name, description, start_date, end_date, status)
  //     VALUES (?, ?, ?, ?, ?)
  //   `;

  //   const projectParams = [
  //     projectData.name,
  //     projectData.description,
  //     projectData.start_date,
  //     projectData.end_date|| null,
  //     projectData.status|| 'ACTIVE',
  //     // projectData.client
  //   ];

  //   try {
  //     const projectResult = await this.databaseService.query(
  //       sql,
  //       projectParams,
  //     );
  //     console.log(projectResult);

  //     const customResponse = new CustomResponse(
  //       HttpStatus.CREATED,
  //       'Project assigned successfully',
  //     );
  //     console.log('Custom Response:', customResponse);

  //     return customResponse;
  //   } catch (error) {
  //     console.error('Error:', error);
  //     throw error;
  //   }
  // }
  async createProjects(projectData: ProjectDto): Promise<CustomResponse> {
    const existingProject = await this.getProjectByName(projectData.name);
    if (existingProject) {
      throw new ConflictException(
        `Project with name '${projectData.name}' already exists`,
      );
    }
  
    const sql = `
      INSERT INTO project (name, description, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    const projectParams = [
      projectData.name,
      projectData.description,
      projectData.start_date,
      projectData.end_date || null,
      projectData.status || 'ACTIVE',
    ];
  
    try {
      const projectResult = await this.databaseService.query(
        sql,
        projectParams,
      );
      console.log(projectResult);
  
      const projectId = projectResult.insertId;
  
      if (projectData.client) {
        const clientSql = `
          INSERT INTO client (name,email, phone,country ,project_id)
          VALUES (?,?,?,?, ?)
        `;
  
        console.log(clientSql);
        
        
        const clientParams = [
          projectData.client,
        
          projectId,
        ];
  
        console.log("clientParams>>>>>>>>>>>>>>",clientParams);
        const clientResult = await this.databaseService.query(
          clientSql,
          clientParams,
        );
        console.log(clientResult);
      }
  
      const customResponse = new CustomResponse(
        HttpStatus.CREATED,
        'Project assigned successfully',
      );
      console.log('Custom Response:', customResponse);
  
      return customResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  

  async getProjectByName(name: string): Promise<any> {
    const sql = 'SELECT * FROM project WHERE name = ?';

    try {
      const result = await this.databaseService.query(sql, [name]);
      return result[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

 
  // async assignProjectToEmployee(
  //   employeeId: number,
  //   projectId: number,
  // ): Promise<CustomResponse> {
  //   const employeeExists = await this.employeeService.findById(employeeId);
  //   if (!employeeExists) {
  //     throw new NotFoundException(`Employee with ID ${employeeId} not found`);
  //   }
  
  //   const projectExists = await this.projectById(projectId);
  //   if (!projectExists) {
  //     throw new NotFoundException(`Project with ID ${projectId} not found`);
  //   }
  
  //   const sql = `
  //     SELECT employee_ids
  //     FROM project
  //     WHERE id = ?
  //   `;
  
  //   try {
  //     const existingEmployeeIds = await this.databaseService.query(sql, [
  //       projectId,
  //     ]);
  //     console.log(existingEmployeeIds);
  
  //     let updatedEmployeeIds = [];
  //     if (existingEmployeeIds.length > 0) {
  //       const currentEmployeeIds = existingEmployeeIds[0].employee_ids || [];
  
  //       if (!currentEmployeeIds.includes(employeeId)) {
  //         updatedEmployeeIds = [...currentEmployeeIds, employeeId];
  //       } else {
  //         updatedEmployeeIds = currentEmployeeIds; 
  //       }
  //     } else {
  //       updatedEmployeeIds = [employeeId];
  //     }
  
  //     const updateSql = `
  //       UPDATE project
  //       SET employee_ids = ?
  //       WHERE id = ?
  //     `;
  
  //     await this.databaseService.query(updateSql, [
  //       updatedEmployeeIds,
  //       projectId,
  //     ]);
  
  //     const customResponse = new CustomResponse(
  //       HttpStatus.OK,
  //       'Project assigned successfully',
  //     );
  //     // console.log('Custom Response:', customResponse);
  
  //     return customResponse;
  //   } catch (error) {
  //     console.error('Error:', error);
  //     throw error;
  //   }
  // }
  async assignProjectToEmployee(
    employeeId: number,
    projectId: number,
  ): Promise<CustomResponse> {
    console.log("Id>>>>>>>>>", employeeId);
    console.log("Id>>>>>>>>>>>", projectId);
  
    const employeeExists = await this.employeeService.findById(employeeId);
    if (!employeeExists) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }
  
    const projectExists = await this.projectById(projectId);
    if (!projectExists) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
  
    const sql = `
      SELECT employee_ids
      FROM project
      WHERE id = ?
    `;
  
    try {
      const existingEmployeeIds = await this.databaseService.query(sql, [
        projectId,
      ]);
      console.log(existingEmployeeIds);
  
      let updatedEmployeeIds = [];
      if (existingEmployeeIds.length > 0) {
        const currentEmployeeIds = existingEmployeeIds[0].employee_ids || [];
  
        if (!currentEmployeeIds.includes(employeeId.toString())) {
          updatedEmployeeIds = [...currentEmployeeIds, employeeId.toString()];
        } else {
          updatedEmployeeIds = currentEmployeeIds; 
        }
      } else {
        updatedEmployeeIds = [employeeId.toString()];
      }
  
      const updateSql = `
        UPDATE project
        SET employee_ids = ?
        WHERE id = ?
      `;
  
      await this.databaseService.query(updateSql, [
        JSON.stringify(updatedEmployeeIds), // Convert the array to a JSON string
        projectId,
      ]);
  
      const customResponse = new CustomResponse(
        HttpStatus.OK,
        'Project assigned successfully',
      );
  
      return customResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  
  

  async getAllProjects(): Promise<ProjectDto[]> {
    const sql = `
     SELECT * FROM project;
    `;

    try {
      const projects = await this.databaseService.query(sql);
      return projects;
    } catch (error) {
      throw error;
    }
  }
  async getProjectsByEmployeeId(employeeId: number): Promise<ProjectDto[]> {
    const sql = `
    SELECT name, id, description, status
    FROM project
    WHERE JSON_SEARCH(employee_ids, 'one', ?) IS NOT NULL
  `;

    try {
      const projects = await this.databaseService.query(sql, [employeeId]);
      if (projects.length === 0) {
        throw new NotFoundException(
          `No projects found for employee with ID ${employeeId}.`,
        );
      }
      return projects;
    } catch (error) {
      throw error;
    }
  }

  async projectById(projectId: number): Promise<boolean> {
    const sql = 'SELECT COUNT(*) AS count FROM project WHERE id = ?';

    try {
      const result = await this.databaseService.query(sql, [projectId]);
      const count = result[0]?.count || 0;
      return count > 0;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateProject(
    projectId: number,
    updatedData: updateProjectDto,
  ): Promise<CustomResponse> {
  
    if (updatedData.name) {
      const existingProjectWithName = await this.getProjectByName(

        updatedData.name,
      );

      console.log( "existingProjectWithName>>>>>>>>>>>>>>>>>>>>>>>", existingProjectWithName);
      
      if (existingProjectWithName && existingProjectWithName.id !== projectId) {
        throw new ConflictException(
          `Project with name '${updatedData.name}' already exists`,
        );
      }
    }

    const projectExists = await this.projectById(projectId);
    console.log("projectExist>>>>>>>>>>>>>>>s", projectExists);
    
    if (!projectExists) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const updateSqlParts = [];
    const projectParams = [];

    if (updatedData.name !== undefined) {
      updateSqlParts.push('name = ?');
      projectParams.push(updatedData.name);
    }
    if (updatedData.description !== undefined) {
      updateSqlParts.push('description = ?');
      projectParams.push(updatedData.description);
    }
    if (updatedData.start_date !== undefined) {
      updateSqlParts.push('start_date = ?');
      projectParams.push(updatedData.start_date);
    }
    if (updatedData.end_date !== undefined) {
      updateSqlParts.push('end_date  = ?');
      projectParams.push(updatedData.end_date);
    }
    if (updatedData.status !== undefined) {
      updateSqlParts.push('status  = ?');
      projectParams.push(updatedData.status);
    }
    // if (updatedData.client !== undefined) {
    //   updateSqlParts.push('client  = ?');
    //   projectParams.push(updatedData.client);
    // }

    const updateSql = `
      UPDATE project
      SET ${updateSqlParts.join(', ')}
      WHERE id = ?
    `;

    projectParams.push(projectId);

    try {
      await this.databaseService.query(updateSql, projectParams);

      const customResponse = new CustomResponse(
        HttpStatus.OK,
        `Project with ID ${projectId} updated successfully`,
      );
      // console.log('Custom Response:', customResponse);

      return customResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // async deleteProject(projectId: number): Promise<void> {
  //   const projectExists = await this.projectById(projectId);
  //   if (!projectExists) {
  //     throw new NotFoundException(`Project with ID ${projectId} not found`);
  //   }

  //   const deleteSql = `
  //     DELETE FROM project
  //     WHERE id = ?
  //   `;

  //   try {
  //     await this.databaseService.query(deleteSql, [projectId]);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     throw new InternalServerErrorException(
  //       'An error occurred while deleting the project.',
  //     );
  //   }
  // }
  async deleteProject(projectId: number): Promise<void> {
    const projectExists = await this.projectById(projectId);
    if (!projectExists) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
  
    const updateSql = `
      UPDATE project
      SET IsDelete = true
      WHERE id = ?
    `;
  
    try {
      await this.databaseService.query(updateSql, [projectId]);
    } catch (error) {
      console.error('Error:', error);
      throw new InternalServerErrorException(
        'An error occurred while soft deleting the project.',
      );
    }
  }
  
}
