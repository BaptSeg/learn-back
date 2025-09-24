import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { IProgressResult, ProgressService } from "./progress/progress.service";

export interface IProgressBody {
    catalogId: string;
    userId: string;
    index: number;
    success: boolean;
    drawn: boolean
}

@Controller("")
export class LearnController {

    constructor(private readonly progressService: ProgressService) {}

    // @UseGuards(JwtAuthGuard)
    @Post("progress")
    async progress(@Body() body: IProgressBody): Promise<IProgressResult> {
        const { catalogId, userId, index, success, drawn } = body;
        return this.progressService.progress(catalogId, userId, index, success, drawn)
    }
}