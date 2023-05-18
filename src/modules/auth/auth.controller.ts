import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from 'src/common/decorators/auth.decorator';


@ApiTags('1. Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto){
    return this.authService.register(userObject)
  }

  @Public()
  @Post('login')
  loginUser(@Body() userObject: LoginAuthDto){
    return this.authService.login(userObject)
  }
}
