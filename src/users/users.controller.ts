import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Inject,
  LoggerService,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/create-user.command';
import { VerifyEmailCommand } from './command/verify-email.command';
import { LoginCommand } from './command/login.command';
import { GetUserInfoQuery } from './query/get-user-info.query';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { Logger as WinstonLogger } from ' winston';

@Controller('users')
export class UsersController {
  constructor(
    private commandBus: CommandBus, // @nestjs/cqrs 패키지에서 제공하는 CommandBus 주입
    private queryBus: QueryBus,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER)
    // private readonly logger: LoggerService,
    // private readonly logger: WinstonLogger,
    // private usersService: UsersService,
    // private authService: AuthService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // this.printLoggerServiceLog(dto);
    // this.printWinstonLog(dto);

    const { name, email, password } = dto;
    // await this.usersService.createUser(name, email, password);
    const command = new CreateUserCommand(name, email, password);

    return this.commandBus.execute(command); // CreateUserCommand를 전송
  }

  // private printLoggerServiceLog(dto) {
  //   try {
  //     throw new InternalServerErrorException('test');
  //   } catch (e) {
  //     this.logger.error('error: ' + JSON.stringify(dto), e.stack);
  //   }
  //   this.logger.warn('warn: ' + JSON.stringify(dto));
  //   this.logger.log('log: ' + JSON.stringify(dto));
  //   this.logger.verbose('verbose: ' + JSON.stringify(dto));
  //   this.logger.debug('debug: ' + JSON.stringify(dto));
  // }

  // private printWinstonLog(dto) {
  //   console.log(this.logger.name);

  //   this.logger.error('error: ', dto);
  //   this.logger.warn('warn: ', dto);
  //   this.logger.info('info: ', dto);
  //   this.logger.http('http: ', dto);
  //   this.logger.verbose('verbose: ', dto);
  //   this.logger.debug('debug: ', dto);
  //   this.logger.silly('silly: ', dto);
  // }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    // return await this.usersService.verifyEmail(signupVerifyToken);
    const command = new VerifyEmailCommand(signupVerifyToken);

    return this.commandBus.execute(command);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    // return await this.usersService.login(email, password);
    const command = new LoginCommand(email, password);

    return this.commandBus.execute(command);
  }

  // @Get(':id')
  // async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
  //   const jwtString = headers.authorization.split('Bearer ')[1];

  //   this.authService.verify(jwtString);

  //   return this.usersService.getUserInfo(userId);
  // }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(
    // @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    // return this.usersService.getUserInfo(userId);
    const getUserInfoQuery = new GetUserInfoQuery(userId);

    return this.queryBus.execute(getUserInfoQuery);
  }
}
