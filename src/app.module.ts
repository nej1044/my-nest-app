import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import authConfig from './config/authConfig';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      /* envFilePath는 NODE_ENV의 값이 stage라면 dist 디렉터리 아래에 존재하는 파일인 .stage.env
        파일의 절대 경로를 가지게 됩니다.*/
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal:
        true /* 전역 모듈로 동작하게 해서 어느 모듈에서나 사용할 수 있게 했습니다. 필요하다면
        EmailModule에만 임모트하면 됩니다. */,
      validationSchema /* 환경 변수의 값에 대해 유효성 검사를 수행하도록 joi를 이용하여 유효성 검사
        객체를 작성합니다. */,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST, // 'localhost',
      port: 3306,
      username: process.env.DATABASE_USERNAME, // 'root',
      password: process.env.DATABASE_PASSWORD, // 'test',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
