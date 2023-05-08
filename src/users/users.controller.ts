import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    console.log(dto);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    /* 이메일 인증 시 URL에 포함되어 전달되는 쿼리 매개변수를 @Query 데코레이터와
      함께 선언한 DTO로 받습니다 */
    console.log(dto);
    return;
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    // 로그인 할 떄 유저가 입력한 데이터는 본문으로 전달되도록 합니다.
    console.log(dto);
    return;
  }

  @Get(
    '/:id',
  ) /* 유저 정보 조회 시 유저 아이디를 패스 매개변수 id로 받습니다. @Get 데코레이터의
    인수에 있는 id와 @Param 데코레이터의 인수로 있는 id는 이름이 같아야 합니다. */
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    console.log(userId);
    return;
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   const { name, email } = createUserDto;

  //   return `유저를 생성했습니다. 이름: ${name}, 이메일: ${email}`;
  // }

  // @Get()
  // findAll(@Res() res) {
  //   const users = this.usersService.findAll();
  //   return res.status(200).send(users);
  // }

  // // @Header('Custom', 'Test Header')
  // // @Redirect('https://nestjs.com', 301)
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   if (+id < 1) {
  //     throw new BadRequestException('id는 0보다 큰 값이어야 합니다');
  //   }
  //   return this.usersService.findOne(+id);
  // }

  // @HttpCode(202)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
