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
import { IWorkTypeRepository, WORK_TYPE_REPOSITORY } from '../domain/work-type.repository';
import { CreateWorkTypeDto } from './dto/create-work-type.dto';
import { UpdateWorkTypeDto } from './dto/update-work-type.dto';
import { toWorkTypeDto } from './work-type-response.mapper';

@Controller('work-types')
export class WorkTypeController {
  constructor(
    @Inject(WORK_TYPE_REPOSITORY)
    private readonly repository: IWorkTypeRepository,
  ) {}

  @Get()
  async list() {
    const types = await this.repository.findAll();
    return types.map(toWorkTypeDto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const workType = await this.repository.findById(id);
    if (!workType) {
      throw new NotFoundException('Вид работ не найден');
    }
    return toWorkTypeDto(workType);
  }

  @Post()
  async create(@Body() dto: CreateWorkTypeDto) {
    const workType = await this.repository.create(dto);
    return toWorkTypeDto(workType);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWorkTypeDto) {
    const workType = await this.repository.update(id, dto);
    return toWorkTypeDto(workType);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repository.delete(id);
    return { success: true };
  }
}
