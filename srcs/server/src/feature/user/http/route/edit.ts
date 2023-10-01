import type { RequestHandler }        from 'express';
import type { NonNullableProperties } from '@/core/typing';
import type { Picture }               from '@/feature/picture/entity';
import type { User }                  from '../../entity';
import type { Position }              from '../../entity';
import { service as database_svc }    from '@/core/database/service';
import { service as validation_svc }  from '@/core/validation/service';
import { NotFoundException }          from '@/feature/error/exception';
import { action as editUser }         from '../../use-case/edit/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Partial<
		NonNullableProperties<Omit<User, 'id'|'id_picture'|'location'>>
		& { picture: Pick<Picture, 'id'|'path'>; }
		& { location: Position; }
	>
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const user = await editUser(validation_svc, database_svc,
	{
		id: req.user!.id,
		id_picture: req.body.id_picture,
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
