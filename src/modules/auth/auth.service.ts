import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { DrizzleService } from '../../database/drizzle.service';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm';
import { SignupDto } from './dto/sighnup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly db: DrizzleService,
  ) {}

  async signup(dto: SignupDto) {
    const { email, password, name } = dto;

    // Supabase Auth signup

    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password,
    });

    if (error) throw new BadRequestException(error.message);

    if (!data.user) throw new BadRequestException('User creation failed');

    await this.db.client.insert(users).values({
      id: data.user.id,
      email,
      name,
    });

    return { message: 'Signup successful', user: data.user };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new BadRequestException(error.message);

    const [user] = await this.db.client
      .select()
      .from(users)
      .where(eq(users.email, email));

    return {
      session: data.session,
      user,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('No refresh token provided');
    }

    const { data, error } = await this.supabase.client.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) throw new BadRequestException(error.message);

    if (!data.session) {
      throw new BadRequestException('Session refresh failed');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }
}
