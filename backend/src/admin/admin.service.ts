import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const totalUsers = await this.prisma.user.count();
    const totalProducts = await this.prisma.product.count();
    const totalCategories = await this.prisma.category.count();

    return {
      totalUsers,
      totalProducts,
      totalCategories,
    };
  }

  async getReports() {
    return this.prisma.auditLog.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      take: 100, // Limita aos últimos 100 registros para não sobrecarregar
    });
  }
}
