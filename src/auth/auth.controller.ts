import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

export interface ILoginBody {
    username: string;
    password: string;
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}
    
    @Post('login')
    async login(@Body() body: ILoginBody) {
        return this.authService.login(body.username, body.password);
    }
    

}
