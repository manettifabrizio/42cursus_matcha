import type { Socket } from 'socket.io';
import { service as db_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as createActivity } from '@/feature/activity/use-case/create/query';

export const onProfileView: (client: Socket) => (...args: any[]) => void =
	(client) => async ({ id_user, username }) => {
		if (typeof id_user !== 'number' || id_user <= 0) {
			client.emit('profile:view:error', {
				id_user,
				error: `Profile id_user must be an integer > 0.`,
			});
			return;
		}

		if (typeof username !== 'string' || username.length > 32) {
			client.emit('profile:view:error', {
				id_user,
				error: `Profile username must be less than 32 characters long.`,
			});
			return;
		}

		try {
			createActivity(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: id_user,
				action: 'WATCHED_PROFILE',
			});

			socket_svc.io().to(`user-${id_user}`).emit(`profile:view`, {
				id_user_from: client.data.user.id,
				username,
			});
		}
		catch (err: unknown) {
			// console.error(`Activity::Socket::onProfileView`, err);
		}
	};
