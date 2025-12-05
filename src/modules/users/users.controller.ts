import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from '@src/modules/users/users.service';
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
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CUSTOMER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CUSTOMER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.CUSTOMER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
