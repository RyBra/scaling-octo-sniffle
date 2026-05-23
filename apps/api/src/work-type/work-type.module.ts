import { Module } from '@nestjs/common';
import { WORK_TYPE_REPOSITORY } from './domain/work-type.repository';
import { PrismaWorkTypeRepository } from './infrastructure/prisma-work-type.repository';
import { WorkTypeController } from './presentation/work-type.controller';

@Module({
  controllers: [WorkTypeController],
  providers: [
    {
      provide: WORK_TYPE_REPOSITORY,
      useClass: PrismaWorkTypeRepository,
    },
  ],
  exports: [WORK_TYPE_REPOSITORY],
})
export class WorkTypeModule {}
