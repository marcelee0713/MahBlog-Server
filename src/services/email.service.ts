import { Transporter, createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EmailParams, IEmailService } from "../interfaces/email.interface";
import { injectable } from "inversify";
import { ErrorType } from "../types";
import { EMAIL_CHANGE_CONTENT, EMAIL_RESET_PASSWORD, EMAIL_VERIFY_CONTENT } from "../constants";

@injectable()
export class EmailService implements IEmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly emailAddress: string;
  private readonly clientBaseUrl: string;

  constructor() {
    this.transporter = createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVICE_USER as string,
        pass: process.env.EMAIL_SERVICE_PASSWORD as string,
      },
    });

    this.emailAddress = process.env.EMAIL_SERVICE_ADDRESS as string;
    this.clientBaseUrl = process.env.CLIENT_BASE_URL as string;
  }

  async sendEmailVerification(info: EmailParams): Promise<void> {
    try {
      const link = `${this.clientBaseUrl}${info.clientRoute}?token=${info.token}`;

      await this.transporter.sendMail({
        to: info.emailToSend,
        from: {
          name: EMAIL_VERIFY_CONTENT.NAME,
          address: this.emailAddress,
        },
        subject: EMAIL_VERIFY_CONTENT.SUBJECT,
        html: `<h1>Email Verification</h1><br><a href=${link}>Confirm Email and Sign in</a><br><p>This will expire in one day. <strong>DO NOT SHARE THIS LINK!</strong></p>`,
      });
    } catch (err) {
      console.log(err);
      throw new Error("email-service-error" as ErrorType);
    }
  }

  async sendEmailChangeConfirmation(info: EmailParams): Promise<void> {
    try {
      const link = `${this.clientBaseUrl}${info.clientRoute}?token=${info.token}`;

      await this.transporter.sendMail({
        to: info.emailToSend,
        from: {
          name: EMAIL_CHANGE_CONTENT.NAME,
          address: this.emailAddress,
        },
        subject: EMAIL_CHANGE_CONTENT.SUBJECT,
        html: `<h1>Email Change Confirmation</h1><br><a href=${link}>Click and confirm</a><br><p>This will expire in one day. <strong>DO NOT SHARE THIS LINK!</strong></p>`,
      });
    } catch (err) {
      throw new Error("email-service-error" as ErrorType);
    }
  }

  async sendPasswordReset(info: EmailParams): Promise<void> {
    try {
      const link = `${this.clientBaseUrl}${info.clientRoute}?token=${info.token}`;

      await this.transporter.sendMail({
        to: info.emailToSend,
        from: {
          name: EMAIL_RESET_PASSWORD.NAME,
          address: this.emailAddress,
        },
        subject: EMAIL_RESET_PASSWORD.SUBJECT,
        html: `<h1>Password Reset</h1><br><a href=${link}>Reset your password</a><br><p>This will expire in one day. <strong>DO NOT SHARE THIS LINK!</strong></p>`,
      });
    } catch (err) {
      throw new Error("email-service-error" as ErrorType);
    }
  }
}
