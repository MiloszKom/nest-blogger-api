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
      envFilePath: `.env.${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // console.log('DB Environment Variables:', {
        //   DB_HOST: configService.get('DB_HOST'),
        //   DB_USERNAME: configService.get('DB_USERNAME'),
        //   DB_NAME: configService.get('DB_NAME'),
        //   DB_SYNC: configService.get('DB_SYNC'),
        //   DB_SSL: configService.get('DB_SSL'),
        //   NODE_ENV: process.env.NODE_ENV,
        // });

        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: 5432,
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [Post, User],
          synchronize: configService.get('DB_SYNC') === 'true',
          ...(configService.get('DB_SSL') === 'true' && {
            ssl: true,
            extra: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
