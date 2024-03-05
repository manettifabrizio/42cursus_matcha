import type { RequestHandler } from 'express';
import type { Picture } from '@/feature/picture/entity';
import { unlink } from 'fs';
import { service as database_svc } from '@/core/database/service';
import { query as createPicture } from '@/feature/picture/use-case/create/query';

// Type ------------------------------------------------------------------------
type ResponseBody = Omit<Picture, 'id_user'>;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) => {
	try {
		database_svc.startTransaction();

		const { id_user, ...picture } = await createPicture(database_svc, {
			id_user: req.user!.id,
			path: req.file!.filename,
		});

		database_svc.commitTransaction();

		return res.status(200).json(picture);
	} catch (err: unknown) {
		database_svc.cancelTransaction();

		unlink(req.file!.path, (e) => {
			e; // console.error(`User::Picture::Add: unlink() failed.`, e);
		});

		throw err;
	} finally {
		database_svc.releaseClient();
	}
};
