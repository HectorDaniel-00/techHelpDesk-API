import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response) => {
        if (response && typeof response === 'object') {
          return {
            success: true,
            data: response.data ?? response,
            message: response.message ?? null,
          };
        }

        return {
          success: true,
          data: response,
          message: null,
        };
      }),
    );
  }
}
