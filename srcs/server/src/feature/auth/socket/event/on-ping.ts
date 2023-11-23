import type { Socket } from 'socket.io';
import { service as db_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as findUserById } from '@/feature/user/use-case/find-by-id-with-position/query';

export const onPing: (client: Socket) => (...args: any[]) => void =
	(client) => async ({ id_user }) => {
		let online: Date | Boolean = (await socket_svc.io().fetchSockets())
			.some((s) => s.data.user.id === Number(id_user));

		if (!online) {
			const user = await findUserById(db_svc, { id: Number(id_user) });

			if (user) {
				online = user.last_seen_at;
			}
		}

		client.emit('pong', {
			id_user: Number(id_user),
			online,
		});
	};
