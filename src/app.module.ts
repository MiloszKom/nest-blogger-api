// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { AppDataSource } from '../data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}`,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    PostsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
