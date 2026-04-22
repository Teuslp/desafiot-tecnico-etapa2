import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  @OnEvent('product.favorited')
  async handleProductFavorited(payload: any) {
    console.log('>>> [EVENTO RECEBIDO] product.favorited', payload);

    // Não notifica se o dono favoritou o próprio produto
    if (payload.ownerId === payload.favoritedBy) {
      console.log('>>> [EVENTO IGNORADO] Dono favoritou o próprio produto.');
      return;
    }

    try {
      // Busca o nome de quem favoritou
      const userThatFavorited = await this.prisma.user.findUnique({
        where: { id: payload.favoritedBy },
        select: { name: true }
      });

      const name = userThatFavorited?.name || 'Alguém';
      const message = `O usuário ${name} favoritou o seu produto "${payload.productTitle}".`;

      const nova = await this.prisma.notification.create({
        data: {
          userId: payload.ownerId,
          message,
        },
      });
      console.log('>>> [NOTIFICAÇÃO SALVA NO BANCO]', nova);
    } catch (error) {
      console.error('>>> [ERRO AO SALVAR NOTIFICAÇÃO]', error);
    }
  }

  async getUnread(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notificação não encontrada.');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}
