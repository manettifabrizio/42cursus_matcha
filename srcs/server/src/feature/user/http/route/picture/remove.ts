import type { RequestHandler }       from 'express';
import { unlink }                    from 'fs';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { ForbiddenException }        from '@/feature/error/exception';
import { NotFoundException }         from '@/feature/error/exception';
import { action as findPictureById } from '@/feature/picture/use-case/find-by-id/action';
import { action as deletePicture }   from '@/feature/picture/use-case/delete/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id: string; }, ResponseBody> = async (req, res) =>
{
	try
	{
		database_svc.startTransaction();

		const picture = await findPictureById(validation_svc, database_svc,
		{
			id: req.params.id,
		});

		if (picture === null)
		{
			throw new NotFoundException(`Image does not exist.`);
		}

		if (picture.id_user !== req.user!.id)
		{
			throw new ForbiddenException(`You can't delete other users picture.`);
		}

		const deleted = await deletePicture(validation_svc, database_svc,
		{
			id: picture.id,
		});

		unlink(req.file!.path, (e) =>
		{
			console.log(e);
		});

		database_svc.commitTransaction();

		return res.status(204).send();
	}
	catch (err: unknown)
	{
		database_svc.cancelTransaction();

		throw err;
	}
	finally
	{
		database_svc.releaseClient();
	}
};
