import type { Socket } from 'socket.io';
import { service as db_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as findLike } from '@/feature/like/use-case/find/query';
import { query as findBlock } from '@/feature/block/use-case/find/query';
import { query as findMessages } from '@/feature/chat/use-case/find/query';

export const onMessageList: (client: Socket) => (...args: any[]) => void =
	(client) => async ({ id_user, page }) => {
		if (typeof id_user !== 'number' || id_user <= 0) {
			client.emit('message:list:error', {
				id_user,
				error: `Message list id_user must be an integer > 0.`
			});
			return;
		}

		if (page && (typeof page !== 'number' || page <= 0)) {
			client.emit('message:list:error', {
				id_user,
				error: `Message list page must be an integer > 0.`
			});
			return;
		}

		try {
			const messages = await findMessages(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: id_user,
				page: {
					size: 25,
					index: Number(page) || 1,
				}
			});

			client.emit('message:list', {
				id_user,
				messages,
			});
		} catch (err: unknown) {
			client.emit('message:list:error', {
				id_user,
				error: `Failed to load messages.`
			});
		}
	};
