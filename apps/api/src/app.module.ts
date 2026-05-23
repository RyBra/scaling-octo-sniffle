import { Module } from '@nestjs/common';
import { ConstructionSiteModule } from './construction-site/construction-site.module';
import { EmployeeModule } from './employee/employee.module';
import { JournalModule } from './journal/journal.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkTypeModule } from './work-type/work-type.module';

@Module({
  imports: [
    PrismaModule,
    ConstructionSiteModule,
    EmployeeModule,
    WorkTypeModule,
    JournalModule,
  ],
})
export class AppModule {}
