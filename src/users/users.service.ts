import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}
  async createUser(name: string, email: string, password: string) {
    /* 가입하려는 유저가 존재하는지 검사합니다. 만약 이미 존재하는 유저, 즉 가입 처리된 유저라면 
    에러를 발생시킵니다. DB를 연동한 후 구현을 해야 하므로 일단 false를 리턴하도록 합니다.*/
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    /* 유저를 데이터베이스에 저장합니다. 아직 데이터베이스를 연결하지 않았으므로, 저장했다고 가정합니다.
    이떄 토큰이 필요한데, 토큰은 유저가 회원 가입 메일을 받고 링크를 눌러 이메일 인증을 할 때 다시 받게 되는
    토큰입니다. 이 토큰으로 현재 가입하려는 회원이 본인의 이메일로 인증한 것인지 한 번 더 검증하는 장치를
    마련합니다. 토큰을 만들 때는 유효 기간을 설정하여 일정 기간 동안만 인증이 가능하도록 할 수도 있습니다.*/
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken); // 회원 가입 인증 메일을 발송합니다.
  }

  private checkUserExists(email: string) {
    /* 가입하려는 유저가 존재하는지 검사합니다. 만약 이미 존재하는 유저, 즉 가입 처리된 유저라면 
    에러를 발생시킵니다. DB를 연동한 후 구현을 해야 하므로 일단 false를 리턴하도록 합니다.*/
    return false; // TODO: DB 연동 후 구현
  }

  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    /* 유저를 데이터베이스에 저장합니다. 아직 데이터베이스를 연결하지 않았으므로, 저장했다고 가정합니다.
    이떄 토큰이 필요한데, 토큰은 유저가 회원 가입 메일을 받고 링크를 눌러 이메일 인증을 할 때 다시 받게 되는
    토큰입니다. 이 토큰으로 현재 가입하려는 회원이 본인의 이메일로 인증한 것인지 한 번 더 검증하는 장치를
    마련합니다. 토큰을 만들 때는 유효 기간을 설정하여 일정 기간 동안만 인증이 가능하도록 할 수도 있습니다.*/
    return; // TODO: DB 연동 후 구현
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    // 회원 가입 인증 메일을 발송합니다.
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
