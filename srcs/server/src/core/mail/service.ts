import { createTransport } from 'nodemailer';
import * as Config         from '@/Config';
import { MailService }     from './types';


const SECURE_PORT = 465;

const mailer = createTransport(
{
	host: Config.MAILER_HOST,
	port: parseInt(Config.MAILER_PORT),
	secure: (parseInt(Config.MAILER_PORT) === SECURE_PORT),
	auth: {
		user: Config.MAILER_USER,
		pass: Config.MAILER_PASS
	}
});

export const service: MailService =
{
	send: mailer.sendMail.bind(mailer)
};
