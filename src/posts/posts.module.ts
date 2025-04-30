import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
