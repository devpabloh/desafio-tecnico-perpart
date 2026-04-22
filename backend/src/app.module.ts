import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './modules/notifications/notificarions.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    CategoriesModule,
    AuthModule,
    NotificationsModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
