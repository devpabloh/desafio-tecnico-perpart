import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProductNotificationListiner {
  @OnEvent('product.interaction')
  handleProductInteration(payload: any) {
    console.log(
      `Notificação enviada para o usuário ${payload.userId} sobre interação no produto ${payload.productId}`,
    );
  }
}
