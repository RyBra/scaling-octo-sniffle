import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ConstructionSiteRecord,
  CreateConstructionSiteData,
  IConstructionSiteRepository,
  UpdateConstructionSiteData,
} from '../domain/construction-site.repository';

@Injectable()
export class PrismaConstructionSiteRepository implements IConstructionSiteRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<ConstructionSiteRecord[]> {
    return this.prisma.constructionSite.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string): Promise<ConstructionSiteRecord | null> {
    return this.prisma.constructionSite.findUnique({ where: { id } });
  }

  create(data: CreateConstructionSiteData): Promise<ConstructionSiteRecord> {
    return this.prisma.constructionSite.create({
      data: { name: data.name.trim(), address: data.address?.trim() || null },
    });
  }

  async update(id: string, data: UpdateConstructionSiteData): Promise<ConstructionSiteRecord> {
    try {
      return await this.prisma.constructionSite.update({
        where: { id },
        data: {
          name: data.name?.trim(),
          address: data.address === undefined ? undefined : data.address?.trim() || null,
        },
      });
    } catch {
      throw new NotFoundException('Строительный объект не найден');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.constructionSite.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Строительный объект не найден');
    }
  }
}
