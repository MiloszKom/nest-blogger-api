import { Expose, Type } from 'class-transformer';
import { PostDto } from '../../posts/dtos/post.dto';

export class UserDetailDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => PostDto)
  posts: PostDto[];

  @Expose()
  createdAt: Date;
}
