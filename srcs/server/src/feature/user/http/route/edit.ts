import type { RequestHandler }       from 'express';
import type { User }                 from '../../entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { NotFoundException }         from '@/feature/error/exception';
import { action as edit }            from '../../use-case/edit/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Partial<Omit<User, 'id'>>
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const user = await edit(validation_svc, database_svc,
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

	if (user === null)
	{
		throw new NotFoundException(`User does not exist.`);
	}

	return res.status(200).json(user);
};
