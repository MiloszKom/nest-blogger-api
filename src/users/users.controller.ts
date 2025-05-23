import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UserDetailDto } from './dtos/user-detail.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Serialize(UserDto)
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

  @Serialize(UserDetailDto)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a user along with all their associated posts.',
  })
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findUser(parseInt(id));
    return {
      statusCode: 200,
      message: 'User fetched successfully',
      data: user,
    };
  }
}
