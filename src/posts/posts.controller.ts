import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dtos/update-post.dto';

import { AuthGuard } from '../auth/auth.guard';
import { CustomRequest } from 'src/auth/customRequest';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findAll() {
    const posts = await this.postsService.findAllPosts();
    return {
      statusCode: 200,
      message: 'Posts fetched successfully',
      data: posts,
    };
  }

  @Get(`:id`)
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.getPost(parseInt(id));
    return {
      statusCode: 200,
      message: 'Post fetched successfully',
      data: post,
    };
  }

  @UseGuards(AuthGuard)
  @Post()
  async createPost(@Body() body: CreatePostDto, @Req() req: CustomRequest) {
    const newPost = await this.postsService.createPost(
      body.title,
      body.content,
      req.user.sub,
    );
    return {
      statusCode: 201,
      message: 'Post created successfully',
      data: newPost,
    };
  }

  @UseGuards(AuthGuard)
  @Patch(`:id`)
  async updatePost(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @Req() req: CustomRequest,
  ) {
    const updatedPost = await this.postsService.updatePost(
      parseInt(id),
      body,
      req.user.sub,
    );

    return {
      statusCode: 200,
      message: 'Post updated successfully',
      data: updatedPost,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Req() req: CustomRequest) {
    await this.postsService.deletePost(parseInt(id), req.user.sub);

    return {
      statusCode: 200,
      message: 'Post deleted successfully',
    };
  }
}
