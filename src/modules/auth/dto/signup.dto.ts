import { UserRole } from '@src/common/enums/user-role.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  MinLength,
  IsOptional,
} from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role must be customer, organizer, or superAdmin',
  })
  role: UserRole;
}
