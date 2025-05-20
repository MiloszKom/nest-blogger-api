import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Post } from './src/posts/post.entity';
import { User } from './src/users/user.entity';

dotenv.config({
  path: `.env.${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}`,
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'test',
  entities: [Post, User],
  synchronize: process.env.DB_SYNC === 'true',
  ssl: process.env.DB_SSL === 'true',
  extra:
    process.env.DB_SSL === 'true'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
});
