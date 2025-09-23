import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Controller("")
export class LearnController {

    constructor() {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    getTest() {
        return "Coucou"
    }
}