import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthDbDao } from './auth.db.dao';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'super-secret-secret',
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthService, AuthDbDao, JwtStrategy],
    controllers: [AuthController]
})

export class AuthModule {}
