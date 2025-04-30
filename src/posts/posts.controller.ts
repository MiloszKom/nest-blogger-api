import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  findAll() {
    console.log('This api endpoint returns all posts');
    return this.postsService.findAll();
  }

  @Get(`:id`)
  findOne(@Param('id') id: string) {
    console.log(`The post id: ${id}`);
    return 'This api endpoint returns a single post';
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    this.postsService.create(createPostDto);
  }

  @Patch(`:id`)
  updatePost(@Param('id') id: string, @Body() body: Object) {
    return 'This api endpoint updates a post';
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    console.log(`The post id: ${id}`);
    return 'This api endpoint deletes a post';
  }
}
