import { Module } from '@nestjs/common';
import { CONSTRUCTION_SITE_REPOSITORY } from './domain/construction-site.repository';
import { PrismaConstructionSiteRepository } from './infrastructure/prisma-construction-site.repository';
import { ConstructionSiteController } from './presentation/construction-site.controller';

@Module({
  controllers: [ConstructionSiteController],
  providers: [
    {
      provide: CONSTRUCTION_SITE_REPOSITORY,
      useClass: PrismaConstructionSiteRepository,
    },
  ],
  exports: [CONSTRUCTION_SITE_REPOSITORY],
})
export class ConstructionSiteModule {}
