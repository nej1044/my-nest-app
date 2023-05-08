import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ApiController } from './api/api.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [UsersModule],
  controllers: [ApiController, UsersController],
  providers: [],
})
export class AppModule {}
