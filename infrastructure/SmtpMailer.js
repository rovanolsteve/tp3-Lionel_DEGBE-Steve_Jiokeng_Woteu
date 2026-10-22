import { EmailAddress } from '../domain/EmailAddress.js';

export class SmtpMailer {
  constructor(smtpConfig) {
    this.smtp = smtpConfig;
    this.outbox = [];
  }

  send({ to, subject, body }) {
    const email = new EmailAddress(to);

    this.outbox.push({
      via: `${this.smtp.host}:${this.smtp.port}`,
      to: email.toString(),
      subject,
      body,
    });
  }
}