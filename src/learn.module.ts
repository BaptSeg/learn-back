import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LearnController } from './learn.controller';
import { ProgressModule } from './progress/progress.module';

@Module({
    imports: [AuthModule, ProgressModule],
    controllers: [LearnController],
})

export class LearnModule {}
