import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    try {
      return await this.authService.signup(dto);
    } catch (err) {
      throw err;
    }
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.login(dto);

      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return {
        message: 'Login successful',
        accessToken: result.accessToken,
        user: result.user,
      };
    } catch (err) {
      throw err;
    }
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies['refresh_token'];
    if (!token) throw new BadRequestException('Refresh token missing');

    try {
      const result = await this.authService.refresh(token);

      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return { accessToken: result.accessToken };
    } catch (err) {
      throw err;
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }
}
