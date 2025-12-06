import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';
import { Roles } from '@src/common/decorators/role.decorator';
import { JwtGuard } from '@src/common/guards/jwt.guard';
import { RoleGuard } from '@src/common/guards/role.guard';
import { UserRole } from '@src/common/enums/user-role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CUSTOMER)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      if (!id) throw new BadRequestException('User ID is required');
      return await this.userService.findOne(id);
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CUSTOMER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      if (!id) throw new BadRequestException('User ID is required');
      return await this.userService.update(id, dto);
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CUSTOMER)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      if (!id) throw new BadRequestException('User ID is required');
      return await this.userService.remove(id);
    } catch (err) {
      throw err;
    }
  }
}
