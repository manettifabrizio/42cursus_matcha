import type { RequestHandler }          from 'express';
import type { Picture }                 from '@/feature/picture/entity';
import { service as database_svc }      from '@/core/database/service';
import { service as validation_svc }    from '@/core/validation/service';
import { action as findPicturesByUser } from '@/feature/picture/use-case/find-by-user/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	pictures: Pick<Picture, 'id'|'path'>[];
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id?: string; }, ResponseBody> = async (req, res) =>
{
	const pictures = await findPicturesByUser(validation_svc, database_svc,
	{
		id_user: req.params.id ?? req.user!.id,
	});

	return res.status(200).json(
	{
		pictures,
	});
};
