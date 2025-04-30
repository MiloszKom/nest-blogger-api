import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dtos/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  findAll() {
    console.log('This api endpoint returns all posts');
    return this.postsService.findAllPosts();
  }

  @Get(`:id`)
  findOne(@Param('id') id: string) {
    return this.postsService.getPost(parseInt(id));
  }

  @Post()
  createPost(@Body() body: CreatePostDto) {
    return this.postsService.createPost(
      body.title,
      body.content,
      body.authorId,
    );
  }

  @Patch(`:id`)
  updatePost(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return this.postsService.updatePost(parseInt(id), body);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    'This api endpoint deletes a post';
    return this.postsService.deletePost(parseInt(id));
  }
}
