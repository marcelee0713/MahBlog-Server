export interface IEmailService {
  sendEmailVerification(info: EmailParams): Promise<void>;
  sendEmailChangeConfirmation(info: EmailParams): Promise<void>;
  sendResetPassword(info: EmailParams): Promise<void>;
}

export interface EmailParams {
  token: string;
  emailToSend: string;
  clientRoute: string;
}
