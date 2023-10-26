import type { Socket } from 'socket.io';
import { service as socket_svc } from '@/core/socket/service';

export const onPing: (client: Socket) => (...args: any[]) => void =
	(client) => async (to: number) => {
		client.emit(
			'pong',
			(await socket_svc.io().fetchSockets()).some(
				(s) => s.data.user.id === to,
			),
		);
	};
