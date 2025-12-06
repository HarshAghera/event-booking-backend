import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { DrizzleService } from '../../database/drizzle.service';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly db: DrizzleService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const { email, password, name, role } = dto;

    try {
      const { data, error } = await this.supabase.client.auth.signUp({
        email,
        password,
      });

      if (error) throw new BadRequestException(error.message);
      if (!data.user) throw new InternalServerErrorException('Signup failed');

      await this.db.client.insert(users).values({
        id: data.user.id,
        email,
        name,
        role: role ?? 'customer',
      });

      return { message: 'Signup successful' };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      console.error('Signup Error:', err);
      throw new InternalServerErrorException('Failed to sign up user');
    }
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    try {
      const { data, error } =
        await this.supabase.client.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw new UnauthorizedException(error.message);

      const [user] = await this.db.client
        .select()
        .from(users)
        .where(eq(users.id, data.user.id));

      if (!user) throw new UnauthorizedException('User not found');

      const accessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email, role: user.role },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      );

      const refreshToken = await this.jwtService.signAsync(
        { sub: user.id, role: user.role },
        { secret: process.env.JWT_SECRET, expiresIn: '7d' },
      );

      return {
        message: 'Login successful',
        accessToken,
        refreshToken,
        user,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      console.error('Login Error:', err);
      throw new InternalServerErrorException('Login failed');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const [user] = await this.db.client
        .select()
        .from(users)
        .where(eq(users.id, payload.sub));

      if (!user) throw new UnauthorizedException('User not found');

      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email, role: user.role },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      );

      const newRefreshToken = await this.jwtService.signAsync(
        { sub: user.id, role: user.role },
        { secret: process.env.JWT_SECRET, expiresIn: '7d' },
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      console.error('Refresh Token Error:', err);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
