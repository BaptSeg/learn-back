import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    private readonly users = [{ username: "learn", password: "poipoi" }];

    async login(username: string) {
        // Normalement tu vérifieras l’utilisateur en DB
        const user = this.users.find(u => u.username === username);
        if (!user) {
            throw new UnauthorizedException();
        } else {
            const payload = { username };
            return { access_token: this.jwtService.sign(payload) };
        }
    }
}