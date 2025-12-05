import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { DrizzleService } from '@src/database/drizzle.service';
import * as jwt from 'jsonwebtoken';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly db: DrizzleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // 1. Extract token from Authorization header OR cookie
    const authHeader = req.headers['authorization'];
    let token: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    // 2. Verify JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET missing');

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 3. Fetch user from DB

    const [user] = await this.db.client
      .select()
      .from(users)
      .where(eq(users.id, decoded.sub));

    if (!user) throw new UnauthorizedException('User not found');

    // 4. Attach user to request
    req.user = user;

    return true;
  }
}
