import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './posts/post.entity';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'test',
      entities: [Post],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
