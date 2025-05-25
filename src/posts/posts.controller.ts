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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dtos/update-post.dto';

import { AuthGuard } from '../auth/auth.guard';
import { CustomRequest } from 'src/auth/customRequest';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({
    summary: 'Get all posts.',
    description: 'Returns a list of all published posts',
  })
  @Get()
  async findAll() {
    const posts = await this.postsService.findAllPosts();
    return {
      statusCode: 200,
      message: 'Posts fetched successfully',
      data: posts,
    };
  }

  @ApiOperation({
    summary: 'Get post by ID',
    description:
      'Returns full details of a specific post including author information',
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.getPost(id);
    return {
      statusCode: 200,
      message: 'Post fetched successfully',
      data: post,
    };
  }

  @ApiOperation({
    summary: 'Create new post',
    description:
      'Creates a new post. Requires authentication and valid post data',
  })
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

  @ApiOperation({
    summary: 'Update post content',
    description:
      'Modifies an existing post. Only the post author can make changes',
  })
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

  @ApiOperation({
    summary: 'Delete post',
    description: 'Permanently removes a post. Requires post author privileges',
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: CustomRequest,
  ) {
    await this.postsService.deletePost(id, req.user.sub);
    return {
      statusCode: 200,
      message: 'Post deleted successfully',
    };
  }
}
