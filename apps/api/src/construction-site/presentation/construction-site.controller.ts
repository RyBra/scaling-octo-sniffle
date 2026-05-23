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
import {
  CONSTRUCTION_SITE_REPOSITORY,
  IConstructionSiteRepository,
} from '../domain/construction-site.repository';
import { CreateConstructionSiteDto } from './dto/create-construction-site.dto';
import { UpdateConstructionSiteDto } from './dto/update-construction-site.dto';
import { toConstructionSiteDto } from './construction-site-response.mapper';

@Controller('construction-sites')
export class ConstructionSiteController {
  constructor(
    @Inject(CONSTRUCTION_SITE_REPOSITORY)
    private readonly repository: IConstructionSiteRepository,
  ) {}

  @Get()
  async list() {
    const sites = await this.repository.findAll();
    return sites.map(toConstructionSiteDto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const site = await this.repository.findById(id);
    if (!site) {
      throw new NotFoundException('Строительный объект не найден');
    }
    return toConstructionSiteDto(site);
  }

  @Post()
  async create(@Body() dto: CreateConstructionSiteDto) {
    const site = await this.repository.create(dto);
    return toConstructionSiteDto(site);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateConstructionSiteDto) {
    const site = await this.repository.update(id, dto);
    return toConstructionSiteDto(site);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repository.delete(id);
    return { success: true };
  }
}
