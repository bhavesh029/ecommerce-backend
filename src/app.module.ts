import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // 1. Load .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly state file path (optional but good practice)
    }),

    // 2. Async Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,

        // Keep true for dev/docker-local, set to false in actual production
        synchronize: true,
      }),
    }),

    // 3. Feature Modules
    ProductsModule,
    CartModule,
    CouponsModule,
    UsersModule,
    OrdersModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
