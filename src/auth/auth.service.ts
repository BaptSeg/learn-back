import * as bcrypt from 'bcrypt';

import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDbDao } from './auth.db.dao';

export interface ILoginResponse {
    userId: string;
    accessToken: string;
}

export interface IUserWithPassword {
    userId: string;
    username: string;
    password: string;
}

@Injectable()
export class AuthService implements OnModuleInit {

    constructor(private authDbDao: AuthDbDao, private jwtService: JwtService) {}

    public async onModuleInit(): Promise<void> {
        await this.authDbDao.connect();
    }

    async login(username: string, password: string): Promise<ILoginResponse> {
        const user = await this.authDbDao.findUserByUsername(username);

        if (!user) {
            throw new UnauthorizedException();
        } else {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                return { userId: user.userId, accessToken: this.jwtService.sign({ userId: user.userId }) };
            } else {
                throw new UnauthorizedException();
            }
        }
    }
}