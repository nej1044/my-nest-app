import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from './UserInfo';
import { UserEntity } from './entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    // UsersService에 @InjectRepository 데코레이터로 유저 저장소를 주입
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private authService: AuthService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    /* 가입하려는 유저가 존재하는지 검사합니다. 만약 이미 존재하는 유저, 즉 가입 처리된 유저라면 
    에러를 발생시킵니다. DB를 연동한 후 구현을 해야 하므로 일단 false를 리턴하도록 합니다.*/
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    /* 유저를 데이터베이스에 저장합니다. 아직 데이터베이스를 연결하지 않았으므로, 저장했다고 가정합니다.
    이떄 토큰이 필요한데, 토큰은 유저가 회원 가입 메일을 받고 링크를 눌러 이메일 인증을 할 때 다시 받게 되는
    토큰입니다. 이 토큰으로 현재 가입하려는 회원이 본인의 이메일로 인증한 것인지 한 번 더 검증하는 장치를
    마련합니다. 토큰을 만들 때는 유효 기간을 설정하여 일정 기간 동안만 인증이 가능하도록 할 수도 있습니다.*/

    // await this.saveUser(name, email, password, signupVerifyToken);
    // await this.saveUserUsingQueryRunner(name, email, password, signupVerifyToken);
    await this.saveUserUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );

    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddress: string): Promise<boolean> {
    /* 가입하려는 유저가 존재하는지 검사합니다. 만약 이미 존재하는 유저, 즉 가입 처리된 유저라면 
    에러를 발생시킵니다. DB를 연동한 후 구현을 해야 하므로 일단 false를 리턴하도록 합니다.*/
    const user = await this.usersRepository.findOne({
      where: {
        email: emailAddress,
      },
    });

    return user !== null;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    /* 유저를 데이터베이스에 저장합니다. 아직 데이터베이스를 연결하지 않았으므로, 저장했다고 가정합니다.
    이떄 토큰이 필요한데, 토큰은 유저가 회원 가입 메일을 받고 링크를 눌러 이메일 인증을 할 때 다시 받게 되는
    토큰입니다. 이 토큰으로 현재 가입하려는 회원이 본인의 이메일로 인증한 것인지 한 번 더 검증하는 장치를
    마련합니다. 토큰을 만들 때는 유효 기간을 설정하여 일정 기간 동안만 인증이 가능하도록 할 수도 있습니다.*/
    const user = new UserEntity(); // 새로운 유저 엔티티 객체를 생성
    user.id = ulid(); // 인수로 전달받은 유저 정보를 엔티티에 설정
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user); // 저장소를 이용하여 엔티티를 데이터베이스에 저장
  }

  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      // throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다

      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    // 회원 가입 인증 메일을 발송합니다.
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
