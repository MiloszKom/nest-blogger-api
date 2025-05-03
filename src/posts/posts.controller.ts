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
  findAll() {
    return this.postsService.findAllPosts();
  }

  @Get(`:id`)
  findOne(@Param('id') id: string) {
    return this.postsService.getPost(parseInt(id));
  }

  @UseGuards(AuthGuard)
  @Post()
  createPost(@Body() body: CreatePostDto, @Req() req: CustomRequest) {
    return this.postsService.createPost(body.title, body.content, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch(`:id`)
  updatePost(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
    @Req() req: CustomRequest,
  ) {
    return this.postsService.updatePost(parseInt(id), body, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deletePost(@Param('id') id: string, @Req() req: CustomRequest) {
    return this.postsService.deletePost(parseInt(id), req.user.sub);
  }
}
