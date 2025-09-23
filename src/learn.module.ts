import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LearnController } from './learn.controller';

@Module({
    imports: [AuthModule],
    controllers: [LearnController],
})

export class LearnModule {}
