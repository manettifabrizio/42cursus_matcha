import type { Socket } from 'socket.io';
import { service as db_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as findLike } from '@/feature/like/use-case/find/query';
import { query as findBlock } from '@/feature/block/use-case/find/query';
import { query as findMessages } from '@/feature/chat/use-case/find/query';

export const onMessageList: (client: Socket) => (...args: any[]) => void =
	(client) => async ({ user, page }) => {
		const io = socket_svc.io();

		try {
			const messages = await findMessages(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: Number(user) || -1,
				page: {
					size: 25,
					index: Number(page) || 1,
				}
			});

			io.to(`user-${client.data.user.id}`).emit('message:list', {
				user: Number(user),
				messages,
			});
		} catch (err: unknown) {
			io.to(`user-${client.data.user.id}`).emit('message:list:error', {
				user: Number(user) || -1,
				error: `Failed to load messages.`
			});
		}
	};
