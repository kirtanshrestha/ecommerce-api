import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { UserSchema} from '../user/schemas/user.schema';
import { AuthGuard } from './auth.guard';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'mySuperSecretKey123!@#^&*()_+-=',
      signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [JwtModule, AuthGuard]
})
export class AuthModule { }