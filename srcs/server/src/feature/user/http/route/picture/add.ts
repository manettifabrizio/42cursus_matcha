import type { RequestHandler }       from 'express';
import type { Picture }              from '@/feature/picture/entity';
import { unlink }                    from 'fs';
import { service as validation_svc } from '@/core/validation/service';
import { service as database_svc }   from '@/core/database/service';
import { action as createPicture }   from '@/feature/picture/use-case/create/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Picture
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	try
	{
		database_svc.startTransaction();

		const picture = await createPicture(validation_svc, database_svc,
		{
			id_user: req.user!.id,
			path: req.file!.path,
		});

		database_svc.commitTransaction();

		return res.status(200).json(picture);
	}
	catch (err: unknown)
	{
		database_svc.cancelTransaction();

		unlink(req.file!.path, (e) =>
		{
			console.log(e);
		});

		throw err;
	}
	finally
	{
		database_svc.releaseClient();
	}
};
