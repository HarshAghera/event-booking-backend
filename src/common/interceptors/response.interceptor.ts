import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: any) => {
        // If response already contains message/data structure
        if (response && typeof response === 'object' && 'data' in response) {
          return {
            success: true,
            message: response.message ?? 'Request successful',
            data: response.data,
            timestamp: new Date().toISOString(),
          };
        }

        // If response is an array → return as-is inside data
        if (Array.isArray(response)) {
          return {
            success: true,
            message: 'Request successful',
            data: response,
            timestamp: new Date().toISOString(),
          };
        }

        // For primitive values: string, number, boolean
        if (['string', 'number', 'boolean'].includes(typeof response)) {
          return {
            success: true,
            message: 'Request successful',
            data: response,
            timestamp: new Date().toISOString(),
          };
        }

        // For objects without 'data' or 'message'
        return {
          success: true,
          message: response?.message ?? 'Request successful',
          data: { ...response, message: undefined },
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
