import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 처리되지 않은 모든 예외를 잡으려고 할 때 사용합니다.
export class HttpExeptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exeption: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exeption instanceof HttpException)) {
      /* 우리가 다루는 대부분의 예외는 이미 Nest에서
      HttpExeption을 상속받는 클래스들로 제공한다고 했습니다. HttpExeption이 아닌 예외는 알 수 없는
      에러이므로 InternalServerErrorExeption으로 처리되도록 했습니다. */
      exeption = new InternalServerErrorException();
    }

    const response = (exeption as HttpException).getResponse();

    const stack = exeption.stack;

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack,
    };

    this.logger.log(log);
    console.log(log);

    res.status((exeption as HttpException).getStatus()).json(response);
  }
}
