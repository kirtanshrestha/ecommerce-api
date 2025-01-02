import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    try(username: any) {
        console.log(username);
    }
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }
    async createUser(createUserDto: CreateUserDto) {
        const { username, password, name , roles } = createUserDto;
        const dupcheck = await this.getUserByUsername(username);
        if ('flag' in dupcheck && dupcheck.flag === 1) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new this.userModel({ name, username, password: hashedPassword, roles });
            return newUser.save();
        }
        else
            throw new ConflictException(`${username} already exists.`);
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async getAllUser(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async getUserByUsername(username: string): Promise<User | object> {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user)
            return { msg: `User with ${username} not found.`, flag: 1, username: `no such  username` };
        // throw new NotFoundException(`user not found`);
        return user;
    }

    async deleteUser(username: string): Promise<void | object> {
        const result = await this.userModel.findOneAndDelete({ username }).exec();
        if (!result)
            throw new NotFoundException(`No ${username} user found to delete`);
        else
            return { message: `${username} has been deleted!` };
    }

}

