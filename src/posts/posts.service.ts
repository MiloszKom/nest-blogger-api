import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAllPosts() {
    return this.postsRepository.find();
  }

  async getPost(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  createPost(title: string, content: string, authorId: number) {
    const newPost = this.postsRepository.create({ title, content, authorId });
    return this.postsRepository.save(newPost);
  }

  async updatePost(id: number, attrs: Partial<Post>) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    Object.assign(post, attrs);
    return this.postsRepository.save(post);
  }

  async deletePost(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.postsRepository.remove(post);
  }
}
