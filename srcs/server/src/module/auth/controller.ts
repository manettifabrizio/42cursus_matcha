import { Router } from 'express';

import { service as crypto_svc }     from '@/core/cryto/service';
import { service as database_svc }   from '@/core/database/service';
import { service as mail_svc }       from '@/core/mail/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as create }          from './useCase/create/action';
import { RegisterResponse }          from './types';


export const controller = Router();

controller.post<{}, RegisterResponse>('/register', async (req, res) =>
{
	const account = await create(validation_svc, database_svc, crypto_svc, req.body);

	// Todo: Match link with frontend routing
	// mail_svc.send({
	// 	from: '"Matcha" <noreply@matcha.com>',
	// 	to: account.email,
	// 	subject: "Account Registration",
	// 	html: `
	// 		Please, click on the following link to validate your registration on matcha.com: <br>
	// 		<a href="${req.protocol}://${req.get('host')}/auth/register-confirm?id=${account.id}&secret=${account.secret}">
	// 			Confirm my email
	// 		</a>
	// 	`
	// });

	res.status(200).json({
		id: account.id,
	});
});
