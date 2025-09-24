import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { IProgressInfo, ProgressService } from "./progress/progress.service";

export interface IProgressBody {
    index: number;
    success: boolean;
    drawn: boolean
}

@Controller("")
export class LearnController {

    constructor(private readonly progressService: ProgressService) {}

    // @UseGuards(JwtAuthGuard)
    @Get("/catalogs/:catalogId/users/:userId/progress")
    async getProgressInfo(
        @Param('catalogId') catalogId: string, 
        @Param('userId') userId: string
    ): Promise<IProgressInfo> {
        return this.progressService.getProgressInfo(catalogId, userId)
    }

    // @UseGuards(JwtAuthGuard)
    @Post("/catalogs/:catalogId/users/:userId/progress")
    async progress(
        @Param('catalogId') catalogId: string, 
        @Param('userId') userId: string,
        @Body() body: IProgressBody
    ): Promise<IProgressInfo> {
        const { index, success, drawn } = body;
        await this.progressService.progress(catalogId, userId, index, success, drawn)
        return this.progressService.getProgressInfo(catalogId, userId);
    }
}