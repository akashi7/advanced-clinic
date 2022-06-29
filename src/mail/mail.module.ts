import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'mail.frutta-fresca.com',
        secure: true,
        auth: {
          user: 'contact@frutta-fresca.com',
          pass: 'contact@1234$',
        },
        defaults: {
          from: '"No Reply" <noreply@kuranga.com>',
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
