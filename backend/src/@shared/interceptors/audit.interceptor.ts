import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url } = request;

    return next.handle().pipe(
      tap(async () => {
        if (user && method !== 'GET') {
          await this.prisma.auditLog.create({
            data: {
              action: `${method} ${url}`,
              resource: url.split('/')[1],
              userId: user.id,
            },
          });
        }
      }),
    );
  }
}
