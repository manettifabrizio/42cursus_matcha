import type { RequestHandler }       from 'express';
import type { Block }                from '@/feature/block/entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as findBlocksFrom }  from '@/feature/block/use-case/find-by-from/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	blocks: Block['id_user_to'][];
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const blocks_from_me = await findBlocksFrom(validation_svc, database_svc,
	{
		id_user_from: req.user!.id,
	});

	return res.status(200).json(
	{
		blocks: blocks_from_me.map(block => block.id_user_to),
	});
};
