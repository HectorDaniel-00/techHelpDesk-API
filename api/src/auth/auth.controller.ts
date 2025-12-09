import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto';
import { Public } from 'src/common/decorator/is-Public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  register(@Body() body: RegisterAuthDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('/login')
  login(@Body() body: LoginAuthDto) {
    return this.authService.login(body);
  }
}
