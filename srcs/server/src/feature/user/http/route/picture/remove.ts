import type { RequestHandler } from 'express';
import { unlink } from 'fs';
import * as path from 'path';
import * as Config from '@/Config';
import { HttpException } from '@/core/exception';
import { service as database_svc } from '@/core/database/service';
import { query as findUserByIdWithPosition } from '@/feature/user/use-case/find-by-id-with-position/query';
import { query as findPictureById } from '@/feature/picture/use-case/find-by-id/query';
import { query as deletePicture } from '@/feature/picture/use-case/delete/query';

// Type ------------------------------------------------------------------------
type RequestParams = {
	id_picture: string;
};

type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestParams, ResponseBody> = async (
	req,
	res,
) => {
	try {
		database_svc.startTransaction();

		const picture = await findPictureById(database_svc, {
			id: Number(req.params.id_picture) || -1,
		});

		if (picture === null) {
			throw new HttpException('Not Found', {
				cause: `Picture doesn't exist.`,
			});
		}

		const user = (await findUserByIdWithPosition(database_svc, {
			id: req.user!.id,
		}))!;

		if (picture.id === user.picture?.id) {
			throw new HttpException('Forbidden', {
				cause: `You can't delete your profile picture.`,
			});
		}

		if (picture.id_user !== user.id) {
			throw new HttpException('Forbidden', {
				cause: `You don't own this picture.`,
			});
		}

		await deletePicture(database_svc, {
			id: picture.id,
		});

		unlink(path.join(Config.PICTURES_DEST, picture.path), (e) => {
			// e && console.log(`User::Picture::Remove: unlink() failed.`, e);
		});

		database_svc.commitTransaction();

		return res.status(204).send();
	} catch (err: unknown) {
		database_svc.cancelTransaction();

		throw err;
	} finally {
		database_svc.releaseClient();
	}
};
