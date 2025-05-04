import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: '10 Tips for Learning TypeScript',
  })
  @IsNotEmpty({ message: 'Title cannot be empty!' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the blog post',
    example:
      'In this post, we’ll explore some of the best practices for mastering TypeScript...',
  })
  @IsNotEmpty({ message: 'Content cannot be empty!' })
  @IsString()
  content: string;
}
