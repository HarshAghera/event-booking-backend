import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { DrizzleModule } from '../../database/drizzle.module';

@Module({
  imports: [SupabaseModule, DrizzleModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
