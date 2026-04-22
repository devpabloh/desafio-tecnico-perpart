import { Module } from '@nestjs/common';
import { ProductNotificationListener } from './listeners/product-notification.listener';

@Module({
  providers: [ProductNotificationListener],
})
export class NotificationsModule {}
