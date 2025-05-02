import { Catch, ArgumentsHost, ConflictException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';
import { PostgresError } from '../types/postgres-error.interface';

@Catch(QueryFailedError)
export class TypeORMExceptionFilter extends BaseExceptionFilter {
  catch(exception: PostgresError, host: ArgumentsHost) {
    if (exception.code === '23505') {
      const detail = exception.detail;
      if (detail?.includes('username')) {
        throw new ConflictException('Username already exists');
      }
      if (detail?.includes('email')) {
        throw new ConflictException('Email already exists');
      }
    }
    super.catch(exception, host);
  }
}
