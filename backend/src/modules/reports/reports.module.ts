import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { ReportsController } from './controllers/reports.controller';
import { GenerateAuditReportService } from './services/generate-audit-report.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportsController],
  providers: [GenerateAuditReportService],
})
export class ReportsModule {}
