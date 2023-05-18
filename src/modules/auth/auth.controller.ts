import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Public } from 'src/common/decorators/auth.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  registerUser(@Body() userObject: RegisterAuthDto){
    return this.authService.register(userObject)
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and generate access token' })
  loginUser(@Body() userObject: LoginAuthDto){
    return this.authService.login(userObject)
  }
}
