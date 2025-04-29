import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get()
  findAll() {
    return 'This api endpoint returns all posts';
  }

  @Get(`:id`)
  findOne(@Param('id') id: string) {
    console.log(`The post id: ${id}`);
    return 'This api endpoint returns a single post';
  }

  @Post()
  createPost(@Body() body: Object) {
    console.log(body);
    return 'This api endpoint creates a post, provided body:';
  }

  @Patch(`:id`)
  updatePost(@Param('id') id: string, @Body() body: Object) {
    console.log(`The post id: ${id}`);
    console.log(body);
    return 'This api endpoint updates a post';
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    console.log(`The post id: ${id}`);
    return 'This api endpoint deletes a post';
  }
}
