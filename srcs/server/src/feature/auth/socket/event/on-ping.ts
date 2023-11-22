import type { Socket } from 'socket.io';
import { service as socket_svc } from '@/core/socket/service';

export const onPing: (client: Socket) => (...args: any[]) => void =
	(client) => async ({ id_user }) => {
		client.emit('pong', {
			id_user: Number(id_user),
			is_online: (await socket_svc.io().fetchSockets()).some(
				(s) => s.data.user.id === Number(id_user),
			),
		});
	};
