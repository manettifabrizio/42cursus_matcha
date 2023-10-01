import type { RequestHandler }               from 'express';
import { unlink }                            from 'fs';
import { service as database_svc }           from '@/core/database/service';
import { ForbiddenException }                from '@/feature/error/exception';
import { NotFoundException }                 from '@/feature/error/exception';
import { query as findUserByIdWithPosition } from '@/feature/user/use-case/find-by-id-with-position/query';
import { query as findPictureById }          from '@/feature/picture/use-case/find-by-id/query';
import { query as deletePicture }            from '@/feature/picture/use-case/delete/query';

// Type ------------------------------------------------------------------------
type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id_picture: string; }, ResponseBody> = async (req, res) =>
{
	try
	{
		database_svc.startTransaction();

		const picture = await findPictureById(database_svc,
		{
			id: Number(req.params.id_picture),
		});

		if (picture === null)
		{
			throw new NotFoundException(`Picture doesn't exist.`);
		}

		const user = (await findUserByIdWithPosition(database_svc,
		{
			id: req.user!.id,
		}))!;

		if (picture.id === user.picture?.id)
		{
			throw new ForbiddenException(`You can't delete your profile picture.`);
		}

		if (picture.id_user !== user.id)
		{
			throw new ForbiddenException(`You don't own this picture.`);
		}

		await deletePicture(database_svc,
		{
			id: picture.id,
		});

		unlink(picture.path, (e) =>
		{
			console.log(`Feature::User::Http::Route::Picture::Remove: unlink() failed.`, e);
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
