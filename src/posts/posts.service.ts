import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CustomRequest } from 'src/auth/customRequest';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  private async findPostById(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  findAllPosts() {
    return this.postsRepository.find();
  }

  async getPost(id: number) {
    return this.findPostById(id);
  }

  createPost(title: string, content: string, authorId: number) {
    const newPost = this.postsRepository.create({ title, content, authorId });
    return this.postsRepository.save(newPost);
  }

  async updatePost(id: number, attrs: Partial<Post>, req: CustomRequest) {
    const post = await this.findPostById(id);
    if (req.user.sub != post.authorId) {
      throw new ForbiddenException("You can't update other users posts");
    }
    Object.assign(post, attrs);
    return this.postsRepository.save(post);
  }

  async deletePost(id: number, req: CustomRequest) {
    const post = await this.findPostById(id);
    if (req.user.sub != post.authorId) {
      throw new ForbiddenException("You can't update other users posts");
    }
    return this.postsRepository.remove(post);
  }
}
