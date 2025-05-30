import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, hanlder: CallHandler): Observable<any> {
    return hanlder.handle().pipe(
      map((data: any) => {
        if (data && data.data !== undefined) {
          return {
            ...data,
            data: plainToInstance(this.dto, data.data, {
              excludeExtraneousValues: true,
            }),
          };
        }

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
