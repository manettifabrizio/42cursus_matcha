import type { RequestHandler }       from 'express';
import { service as crypto_svc }     from '@/core/cryto/service';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { AuthException }             from '../../exception';
import { action as updatePassword }  from '../../use-case/update-password/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const account = await updatePassword(validation_svc, database_svc, crypto_svc,
	{
		id: req.body.id,
		secret: req.body.secret,
		password: req.body.password,
		password_confirm: req.body.password_confirm,
	});

	if (account === null)
	{
		throw new AuthException({
			cause: "Invalid credentials.",
		});
	}

	return res.status(204).send();
};
