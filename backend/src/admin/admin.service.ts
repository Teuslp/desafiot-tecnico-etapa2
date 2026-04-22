import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const totalUsers = await this.prisma.user.count();
    const totalProducts = await this.prisma.product.count();
    const totalCategories = await this.prisma.category.count();
    const totalFavorites = await this.prisma.favorites.count();

    const recentActivities = await this.prisma.auditLog.findMany({
      take: 5,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return {
      totalUsers,
      totalProducts,
      totalCategories,
      totalFavorites,
      recentActivities,
    };
  }

  async getReports(pageStr?: string, limitStr?: string, search?: string, methodFilter?: string) {
    const page = Number(pageStr) || 1;
    const limit = Number(limitStr) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { route: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (methodFilter) {
      where.method = methodFilter;
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
