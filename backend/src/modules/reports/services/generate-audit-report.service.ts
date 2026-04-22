import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

interface GenerateAuditReportRequest {
  userId?: string;
  resource?: string;
  action?: string;
  from?: Date;
  to?: Date;
  page?: number;
}

@Injectable()
export class GenerateAuditReportService {
  constructor(private prisma: PrismaService) {}

  async execute({
    userId,
    resource,
    action,
    from,
    to,
    page = 1,
  }: GenerateAuditReportRequest) {
    const where = {
      userId: userId || undefined,
      resource: resource || undefined,
      action: action
        ? { contains: action, mode: 'insensitive' as const }
        : undefined,
      timestamp:
        from || to
          ? {
              gte: from,
              lte: to,
            }
          : undefined,
    };

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 20,
        skip: (page - 1) * 20,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      page,
      perPage: 20,
      total,
      items,
    };
  }
}
