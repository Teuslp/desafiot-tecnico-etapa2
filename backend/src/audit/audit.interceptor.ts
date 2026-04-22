import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    return next.handle().pipe(
      tap(async () => {
        // Apenas logar ações que modificam o estado
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          // Ignora a rota de login para evitar logs excessivos de autenticação, se preferir
          if (url.includes('/auth/login')) return;

          try {
            await this.prisma.auditLog.create({
              data: {
                userId: user?.id || null, // Se for rota pública, pode não ter user
                action: 'SUCCESS',
                method,
                route: url,
              },
            });
          } catch (error) {
            console.error('Erro ao gravar log de auditoria:', error);
          }
        }
      }),
    );
  }
}
