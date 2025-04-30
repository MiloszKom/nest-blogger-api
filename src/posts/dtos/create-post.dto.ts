import { IsString, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsInt()
  authorId: number;
}
