import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsListener {
  private readonly logger = new Logger(NotificationsListener.name);

  @OnEvent('product.favorited')
  handleProductFavoritedEvent(payload: { productTitle: string; ownerEmail: string; ownerId: number; favoritedBy: number }) {
    // Aqui seria onde enviaríamos um email, push notification ou websocket.
    // Vamos simular a notificação logando no console.
    this.logger.log(`[NOTIFICAÇÃO] O usuário de ID ${payload.favoritedBy} favoritou o produto "${payload.productTitle}". Notificando dono (${payload.ownerEmail})...`);
  }
}
