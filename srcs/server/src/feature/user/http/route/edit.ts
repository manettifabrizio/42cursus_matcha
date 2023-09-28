import type { RequestHandler }       from 'express';
import type { User }                 from '../../entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as editProfile }     from '../../use-case/edit/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Partial<Omit<User, 'id'>>
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const user = await editProfile(validation_svc, database_svc,
	{
		id: req.user!.id,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		birthdate: req.body.birthdate,
		gender: req.body.gender,
		orientation: req.body.orientation,
		biography: req.body.biography,
		location: req.body.location,
	});

	return res.status(200).json(user!);
};
