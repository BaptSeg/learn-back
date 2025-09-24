import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, ILoginResponse } from './auth.service';

export interface ILoginBody {
    username: string;
    password: string;
}

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}
    
    @Post('login')
    async login(@Body() body: ILoginBody): Promise<ILoginResponse> {
        return this.authService.login(body.username, body.password);
    }
    

}
