import { Injectable } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
  private readonly posts: Post[] = [];

  findAll(): Post[] {
    return this.posts;
  }

  create(post: Post) {
    this.posts.push(post);
  }
}
