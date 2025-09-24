import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthDbDao } from './auth.db.dao';
import { MongoModule } from 'src/mongo/mongo.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'super-secret-secret',
            signOptions: { expiresIn: '60s' },
        }),
        MongoModule
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthDbDao, JwtStrategy],
    exports: [AuthService]
})

export class AuthModule {}
