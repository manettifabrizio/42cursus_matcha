import { createTransport } from 'nodemailer';


export interface MailService
{
	send: ReturnType<typeof createTransport>['sendMail']
};
