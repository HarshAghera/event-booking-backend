import { Module } from '@nestjs/common';
import { DrizzleService } from '@src/database/drizzle.service';
import { UserController } from '@src/modules/users/users.controller';
import { UserService } from '@src/modules/users/users.service';
import { SupabaseService } from '@src/supabase/supabase.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DrizzleService, SupabaseService],
})
export class UsersModule {}
