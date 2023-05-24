import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'test',
  database: 'test',
  entities: [__dirname + '/**/*.entity{.ts,.js'],
  synchronize:
    false /* 마이그레이션 테스트를 원활하게 하기 위해 Synchronize를 False로 변경합니다.
    그렇지 않으면 서버가 새로 구동될 때마다 테이블이 자동으로 생겨서 불편합니다.*/,
  migrationsRun: false /* 서버가 구동될 때 작성된 마이그레이션 파일을 기반으로
    마이그레이션을 수행하게 할지 설정하는 옵션입니다. FALSE로 설정하여 CLI 명령어를 직접 입력하도록 합니다.*/,
  migrations: [
    __dirname + '/**/migrations/*.js',
  ] /* 마이그레이션을 수행할 파일이 관리되는 경로를
    설정합니다. */,
  migrationsTableName:
    'migrations' /* 마이그레이션 이력이 기록되는 테이블 이름. 생략할 경우 기본값은 migrations입니다. */,
});
