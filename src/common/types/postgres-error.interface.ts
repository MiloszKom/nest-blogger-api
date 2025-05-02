import { QueryFailedError } from 'typeorm';

export interface PostgresError extends QueryFailedError {
  detail?: string;
  code?: string;
}
