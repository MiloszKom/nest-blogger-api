import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'The new title of the blog post',
    example: 'Updated Title: Mastering TypeScript',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The updated content of the blog post',
    example: 'This updated post includes more advanced TypeScript tips...',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;
}
