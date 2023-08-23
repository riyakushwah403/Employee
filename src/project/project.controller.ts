import { Controller,Post,Param,Body,Get,Query,Patch ,Delete,HttpStatus } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto, updateProjectDto } from './Dto files/projectDto';
import { CustomResponse } from 'src/response/successResponse';
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}


  // @Post('add')
  // async createProject(@Body() projectData: ProjectDto): Promise<CustomResponse> {
  //   const customResponse = await this.projectService.createProjects(projectData);
  //   return customResponse;
  // }

  @Post('add')
  async createProject(
    @Body() projectData: ProjectDto,
  ): Promise<CustomResponse> {
    const customResponse = await this.projectService.createProjects(projectData);
    return customResponse;
  }
  // @Post('assign/:employeeId')
  // async assignProjectToEmployee(
  //   @Param('employeeId') employeeId: number,
  //   @Query('projectId') projectId: number,
  // ): Promise<CustomResponse> {
  //   const customResponse = await this.projectService.assignProjectToEmployee(employeeId, projectId);
  //   return customResponse;
  // }
  @Post('assign')
  async assignProjectToEmployee(
    @Body() assignmentData: { employeeId: number, projectId: number }
  ): Promise<CustomResponse> {
    const { employeeId, projectId } = assignmentData;
  console.log(assignmentData.employeeId);
  console.log(assignmentData.projectId);
  
  
    try {
      const customResponse = await this.projectService.assignProjectToEmployee(employeeId, projectId);
      return customResponse;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  


  @Get('')
  async getAllProjects(): Promise<ProjectDto[]> {
    return this.projectService.getAllProjects();
  }

  @Get(':employeeId')
  async getProjectsByEmployeeId(@Param('employeeId') employeeId: number): Promise<ProjectDto[]> {
    return this.projectService.getProjectsByEmployeeId(employeeId);
  }

  @Patch(':id')
  async updateProject(
    @Param('id') projectId: number,
    @Body() updatedData: updateProjectDto,
  ): Promise<CustomResponse> {
    return this.projectService.updateProject(projectId, updatedData);
  }

  @Delete(':id')
  async deleteProject(@Param('id') projectId: number): Promise<CustomResponse> {
    await this.projectService.deleteProject(projectId);
    const customResponse = new CustomResponse(
      HttpStatus.OK,
      `Project with ID ${projectId} deleted successfully`,
    );
    console.log('Custom Response:', customResponse);
    return customResponse;
  }
}
