import { Module } from "@nestjs/common";
import { ProgressDbDao } from "./progress.db.dao";
import { MongoModule } from "src/mongo/mongo.module";
import { ProgressService } from "./progress.service";

@Module({
    imports: [MongoModule],
    providers: [ProgressDbDao, ProgressService],
    exports: [ProgressService]
})

export class ProgressModule {}