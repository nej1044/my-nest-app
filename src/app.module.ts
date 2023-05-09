import { Module } from '@nestjs/common';
import { UsersConroller } from './users/users.controller';
import { UserService } from './users/users.service';
import { EmailService } from './email/email.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
})
export class AppModule {}
