import {
  Catch,
  ArgumentsHost,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';
import { PostgresError } from '../types/postgres-error.interface';

@Catch(QueryFailedError)
export class TypeORMExceptionFilter extends BaseExceptionFilter {
  catch(exception: PostgresError, host: ArgumentsHost) {
    if (exception.code === '42P01') {
      throw new InternalServerErrorException('Database table missing');
    }

    super.catch(exception, host);
  }
}
