import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    //Get token from Authorization header OR cookie
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

    //Verify token with Supabase JWT secret
    try {
      const secret = process.env.SUPABASE_JWT_SECRET;

      if (!secret) {
        throw new Error('SUPABASE_JWT_SECRET not configured');
      }

      const decoded = jwt.verify(token, secret);

      //Attach decoded user payload to request
      req.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
