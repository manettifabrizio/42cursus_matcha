import { RequestHandler }            from 'express';
import { service as crypto_svc }     from '@/core/cryto/service';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as editPassword }    from '../../use-case/edit-password/action';


type ResponseBody =
	void
;

export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	await editPassword(validation_svc, database_svc, crypto_svc,
	{
		id: req.user!.id,
		password: req.body.password,
		password_confirm: req.body.password
	});

	res.status(204).send();
};
