import { RequestHandler }            from 'express';
import { service as crypto_svc }     from '@/core/cryto/service';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as editPassword }    from '../../use-case/edit-password/action';
import { EditPasswordResponse }      from '../types';


export const route: RequestHandler<{}, EditPasswordResponse> = async (req, res) =>
{
	await editPassword(validation_svc, database_svc, crypto_svc, {
		password: req.body.password,
		password_confirm: req.body.password_confirm,
		id: req.user!.id,
	});

	res.status(204).send();
};
