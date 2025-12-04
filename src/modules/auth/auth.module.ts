import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { DrizzleModule } from '../../database/drizzle.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    SupabaseModule,
    DrizzleModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
