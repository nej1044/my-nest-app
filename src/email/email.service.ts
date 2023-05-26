import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import { Inject, Injectable } from '@nestjs/common';
import emailConfig from 'src/config/emailConfig';
import { ConfigType } from '@nestjs/config';

interface EmailOptions {
  // 메일 옵션 타입입니다. 수신자, 메일 제목, html 형식의 메일 본문을 가집니다.
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    /* 주입받을 때는 @Inject 데커레이터의 토큰을 앞서 만든 ConfigFactory의 KEY인 'email'
      문자열로 넣어주면 됩니다. */
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      // nodemailer에서 제공하는 Transporter 객체를 생성합니다.
      service: config.service, // .env 파일에 있는 값들을 사용합니다.
      auth: {
        user: config.auth.user, // .env 파일에 있는 값들을 사용합니다.
        pass: config.auth.pass, // .env 파일에 있는 값들을 사용합니다.
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = this.config.baseUrl; // .env 파일에 있는 값들을 사용합니다.

    // 유저가 누를 버튼이 가질 링크를 구성합니다. 이 링크를 통해 다시 우리 서비스로 이메일 인증 요청이 들어옵니다.
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      // 메일 본문을 구성합니다. form 태그를 이용하여 POST 요청을 합니다.
      html: `
        가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
