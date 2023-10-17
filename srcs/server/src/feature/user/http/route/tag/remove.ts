import type { RequestHandler } from 'express';
import { service as database_svc } from '@/core/database/service';
import { query as removeTag } from '@/feature/user-tag/use-case/delete/query';

// Type ------------------------------------------------------------------------
type RequestParams = {
	id_tag: string;
};

type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestParams, ResponseBody> = async (
	req,
	res,
) => {
	await removeTag(database_svc, {
		id_user: req.user!.id,
		id_tag: Number(req.params.id_tag) || -1,
	});

	return res.status(204).send();
};
