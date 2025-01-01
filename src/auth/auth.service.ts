import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, @InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ username }).exec();

        if (user !== null) {
            const isPasswordValid = await this.validatePassword(password, user.password);
            if (isPasswordValid) {
                return { flag: 1, roles: user.roles };
            }
            else
                return { flag: 2 };
        }
        return { flag: 0 };
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    generateToken(username: any, roles: any): any {
     
        const payload = { username: username, roles: roles }
        return this.jwtService.sign(payload, { expiresIn: '15m' });
    }
}