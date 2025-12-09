import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto';
import { Public } from 'src/common/decorator/is-Public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() body: RegisterAuthDto) {
    return await this.authService.register(body);
  }

  @Public()
  @Post('/login')
  async login(@Body() body: LoginAuthDto) {
    return await this.authService.login(body);
  }
}
