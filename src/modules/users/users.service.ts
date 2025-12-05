import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleService } from '@src/database/drizzle.service';
import { users } from '@src/database/schema/users';
import { SupabaseService } from '@src/supabase/supabase.service';

@Injectable()
export class UserService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly supabase: SupabaseService,
  ) {}

  async findAll() {
    return this.drizzle.client.select().from(users);
  }

  async findOne(id: string) {
    const user = await this.drizzle.client
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!user.length) throw new NotFoundException('User not found');

    return user[0];
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    return this.drizzle.client
      .update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning();
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    // Delete from Supabase Auth first
    const { error } = await this.supabase.client.auth.admin.deleteUser(user.id);

    if (error) {
      throw new BadRequestException('Failed to delete user from Supabase');
    }

    // Delete from your local DB
    return await this.drizzle.client
      .delete(users)
      .where(eq(users.id, id))
      .returning();
  }
}
