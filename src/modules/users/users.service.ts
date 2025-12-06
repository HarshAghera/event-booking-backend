import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
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
    try {
      return await this.drizzle.client.select().from(users);
    } catch (err) {
      console.error('FindAll Error:', err);
      throw new InternalServerErrorException('Unable to fetch users');
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.drizzle.client
        .select()
        .from(users)
        .where(eq(users.id, id));

      if (!result.length) throw new NotFoundException('User not found');

      return result[0];
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      console.error('FindOne Error:', err);
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id); // will throw if user does not exist

    try {
      const result = await this.drizzle.client
        .update(users)
        .set(dto)
        .where(eq(users.id, id))
        .returning();

      return result[0];
    } catch (err) {
      console.error('Update Error:', err);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    try {
      // Delete from Supabase Auth
      const { error } = await this.supabase.client.auth.admin.deleteUser(
        user.id,
      );

      if (error) {
        console.error('Supabase Delete Error:', error);
        throw new BadRequestException('Failed to delete user from Supabase');
      }

      // Delete from local DB
      const deleted = await this.drizzle.client
        .delete(users)
        .where(eq(users.id, id))
        .returning();

      return deleted[0];
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      console.error('Delete Error:', err);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
