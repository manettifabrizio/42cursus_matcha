import type { RequestHandler }       from 'express';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { AuthException }             from '../../exception';
import { action as confirmEmail }    from '../../use-case/email-confirm/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const account = await confirmEmail(validation_svc, database_svc,
	{
		id: req.body.id,
		secret: req.body.secret,
	});

	if (account === null)
	{
		throw new AuthException({
			cause: `Invalid credentials.`
		});
	}

	return res.status(204).send();
};
