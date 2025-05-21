import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users',
  })
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      statusCode: 200,
      message: 'Users fetched successfully',
      data: users,
    };
  }
}
