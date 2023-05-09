import { Body, Controller, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {} // UsersService를 컨트롤러에 주입

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, eamil, password } = dto;
    await this.usersService.createUser(name, email, password);
  }
}
