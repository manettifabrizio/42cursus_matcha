import type { Socket } from 'socket.io';
import { service as db_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as createActivity } from '@/feature/activity/use-case/create/query';
import { query as findUserById } from '@/feature/user/use-case/find-by-id-with-position/query';
import { query as findBlock } from '@/feature/block/use-case/find/query';

export const onProfileView: (client: Socket) => (...args: any[]) => void =
	(client) =>
	async ({ id_user }) => {
		if (typeof id_user !== 'number' || id_user <= 0) {
			client.emit('profile:view:error', {
				id_user,
				error: `Profile id_user must be an integer > 0.`,
			});
			return;
		}

		if (id_user === client.data.user.id) {
			return;
		}

		try {
			const is_created = await createActivity(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: id_user,
				action: 'WATCHED_PROFILE',
			});

			if (!is_created) return;

			const is_blocked = await findBlock(db_svc, {
				id_user_from: id_user,
				id_user_to: client.data.user.id,
			});

			if (is_blocked) return;

			const user = await findUserById(db_svc, {
				id: client.data.user.id,
			});

			if (user === null) return;

			socket_svc.io().to(`user-${id_user}`).emit(`profile:view`, {
				id_user_from: user.id,
				firstname: user.firstname,
				lastname: user.lastname,
			});
		} catch (err: unknown) {
			// console.error(`Activity::Socket::onProfileView`, err);
		}
	};
