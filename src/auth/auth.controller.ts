import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { dot } from 'node:test/reporters';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authServices:AuthService){}
    @Post("signup")
    signup(@Body() dto:AuthDto){
        return this.authServices.signup(dto)
    }
    @Post("signin")
    signin(@Body() dto:AuthDto){
        return this.authServices.signin(dto)
    }
}
