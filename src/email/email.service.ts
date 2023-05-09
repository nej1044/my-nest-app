import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface EmailOptions {
  // 메일 옵션 타입입니다. 수신자, 메일 제목, html 형식의 메일 본문을 가집니다.
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // nodemailer에서 제공하는 Transporter 객체를 생성합니다.
      service: 'Gmail',
      auth: {
        user: 'GMAIL',
        pass: 'PASSWORD',
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000';

    // 유저가 누를 버튼이 가질 링크를 구성합니다. 이 링크를 통해 다시 우리 서비스로 이메일 인증 요청이 들어옵니다.
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      // 메일 본문을 구성합니다. form 태그를 이용하여 POST 요청을 합니다.
      html: `가입확인 버튼을 누르시면 가입 인증이 완료됩니다.<br />
              <form action="${url}" method="POST" >
                <button>가입확인 </button>
              </form>`,
    };

    return await this.transporter.sendMail(mailOptions); // transporter 객체를 이용하여 메일을 전송합니다.
  }
}
