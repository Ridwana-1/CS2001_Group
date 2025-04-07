import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User, Prisma } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':fullname')
  async findByFullname(@Param('fullname') fullname: string): Promise<User | null> {
    return this.userService.findByFullname(fullname);
  }

  @Get('id/:id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }
  @Post()
  async create(@Body() userData: Prisma.UserCreateInput): Promise<User> {
    return this.userService.create(userData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
