import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExeptionFilter } from './http-exeption.filter';

@Module({
  // HttpExeptionFilter와 주입받을 Logger를 프로바이더로 선언
  providers: [Logger, { provide: APP_FILTER, useClass: HttpExeptionFilter }],
})
export class ExeptionModule {}
