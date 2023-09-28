import type { RequestHandler }       from 'express';
import type { Block }                from '@/feature/block/entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as findBlocksFrom }  from '@/feature/block/use-case/find-by-from/action';
import { action as findBlocksTo }    from '@/feature/block/use-case/find-by-to/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	to: Block['id_user_to'][];
	from: Block['id_user_from'][];
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const blocks_from_me = await findBlocksFrom(validation_svc, database_svc,
	{
		id_user_from: req.user!.id,
	});

	const blocks_to_me = await findBlocksTo(validation_svc, database_svc,
	{
		id_user_to: req.user!.id,
	});

	return res.status(200).json(
	{
		to: blocks_from_me.map(block => block.id_user_to),
		from: blocks_to_me.map(block => block.id_user_from),
	});
};
