import type { RequestHandler }            from 'express';
import type { User }                      from '@/feature/user/entity';
import type { Report }                    from '@/feature/report/entity';
import { service as database_svc }        from '@/core/database/service';
import { query as findReportsByUserFrom } from '@/feature/report/use-case/find-by-user-from/query';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	reports: {
		by_me: (Pick<User, 'id'> & Pick<Report, 'created_at'>)[];
	};
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const reported_users = await findReportsByUserFrom(database_svc,
	{
		id_user_from: req.user!.id,
	});

	return res.status(200).json(
	{
		reports: {
			by_me: reported_users,
		},
	});
};
