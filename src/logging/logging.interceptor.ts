import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url, body } = context.getArgByIndex(0); // 실행 콘텍스트에 포함된 첫 번째 객체를 얻어옵니다. 이 객체로부터 요청 정보를 얻을 수 있습니다.
    this.logger.log(`Request to ${method} ${url}`); // 요청의 HTTP 메서드와 URL을 로그로 출력합니다.

    return next.handle().pipe(
      tap((data) =>
        this.logger.log(
          `Response from ${method} ${url} \n response: ${JSON.stringify(data)}`, // 응답 로그에도 HTTP 메서드와 URL과 함께 응답결과를 함께 출력합니다.
        ),
      ),
    );
  }
}
