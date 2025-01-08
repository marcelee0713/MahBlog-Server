import { Transporter, createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {
  DeviceVerificationEmailParams,
  EmailParams,
  IEmailService,
} from "../ts/interfaces/email.interface";
import { injectable } from "inversify";
import {
  DEVICE_VERIFY_CONTENT,
  EMAIL_CHANGE_CONTENT,
  EMAIL_RESET_PASSWORD,
  EMAIL_VERIFY_CONTENT,
  USER_DELETION_CONTENT,
} from "../constants";
import { CustomError } from "../utils/error_handler";

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
      throw new CustomError("email-service-error");
    }
  }

  async sendDeviceVerification(info: DeviceVerificationEmailParams): Promise<void> {
    const link = `${this.clientBaseUrl}${info.clientRoute}?token=${info.token}`;

    await this.transporter.sendMail({
      to: info.emailToSend,
      from: {
        name: DEVICE_VERIFY_CONTENT.NAME,
        address: this.emailAddress,
      },
      subject: DEVICE_VERIFY_CONTENT.SUBJECT,
      html: `<h1>Device Verification</h1>
      <br>
      <a href=${link}>Enter the code here</a>
      <br>
      <p>Code: <strong>${info.code}</strong> </p>
      <p>This will expire in 10 minutes. <strong>DO NOT SHARE THIS LINK!</strong></p>`,
    });
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
      throw new CustomError("email-service-error");
    }
  }

  async sendResetPassword(info: EmailParams): Promise<void> {
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
      throw new CustomError("email-service-error");
    }
  }

  async sendUserDeletionVerification(info: EmailParams): Promise<void> {
    try {
      const link = `${this.clientBaseUrl}${info.clientRoute}?token=${info.token}`;

      await this.transporter.sendMail({
        to: info.emailToSend,
        from: {
          name: USER_DELETION_CONTENT.NAME,
          address: this.emailAddress,
        },
        subject: USER_DELETION_CONTENT.SUBJECT,
        html: `<h1>User Deletion</h1>
        <br>
        <a href=${link}>Delete your account</a><br>
        <p>This will expire in 10 minutes. <strong>DO NOT SHARE THIS LINK!</strong></p>`,
      });
    } catch (err) {
      throw new CustomError("email-service-error");
    }
  }
}
