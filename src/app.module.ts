import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { StripeModule } from './stripe/stripe.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Make the variables available globally
    }),
    MongooseModule.forRoot('mongodb+srv://workkirtanshrestha:HxAL4qaQXAOnVwVn@cluster0.ay4vt.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'),
    ProductModule,
    OrdersModule,
    AuthModule,
    AuthModule, PassportModule,
    JwtModule.register({
      secret: 'mySuperSecretKey123!@#^&*()_+-=',
      signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
    }),
    UserModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
