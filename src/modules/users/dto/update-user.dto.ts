import { UserRole } from '@src/common/enums/user-role.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role must be customer, organizer, or superAdmin',
  })
  role?: UserRole;
}
