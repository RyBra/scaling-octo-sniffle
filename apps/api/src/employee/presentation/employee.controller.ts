import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EMPLOYEE_REPOSITORY, IEmployeeRepository } from '../domain/employee.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { toEmployeeDto } from './employee-response.mapper';

@Controller('employees')
export class EmployeeController {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly repository: IEmployeeRepository,
  ) {}

  @Get()
  async list() {
    const employees = await this.repository.findAll();
    return employees.map(toEmployeeDto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new NotFoundException('Сотрудник не найден');
    }
    return toEmployeeDto(employee);
  }

  @Post()
  async create(@Body() dto: CreateEmployeeDto) {
    const employee = await this.repository.create(dto);
    return toEmployeeDto(employee);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    const employee = await this.repository.update(id, dto);
    return toEmployeeDto(employee);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repository.delete(id);
    return { success: true };
  }
}
