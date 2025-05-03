import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title cannot be empty!' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Content cannot be empty!' })
  @IsString()
  content: string;
}
