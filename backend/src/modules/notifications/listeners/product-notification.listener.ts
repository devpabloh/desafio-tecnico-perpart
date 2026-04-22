import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProductNotificationListener {
  @OnEvent('product.created')
  handleProductInteraction(payload: any) {
    console.log(
      `Notificação enviada para o usuário ${payload.userId} sobre interação no produto ${payload.productId}`,
    );
  }

  @OnEvent('product.favorited')
  handleProductFavorited(payload: {
    productId: string;
    actorUserId: string;
    ownerUserId: string;
  }) {
    console.log(
      `Notificação: usuário ${payload.actorUserId} favoritou o produto ${payload.productId} do usuário ${payload.ownerUserId}`,
    );
  }
}
