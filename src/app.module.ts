import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './posts/post.entity';
import { User } from './users/user.entity';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PostsModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'test',
        entities: [Post, User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
