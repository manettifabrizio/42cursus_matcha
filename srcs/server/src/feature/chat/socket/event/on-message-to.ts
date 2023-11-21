import type { Socket } from 'socket.io';
import { service as db_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as findLike } from '@/feature/like/use-case/find/query';
import { query as findBlock } from '@/feature/block/use-case/find/query';
import { query as createMessage } from '@/feature/chat/use-case/create/query';

export const onMessageTo: (client: Socket) => (...args: any[]) => void =
	(client) => async ({ content, user }) => {
		const io = socket_svc.io();

		if (String(content).length < 1 || String(content).length > 512) {
			client.emit('message:to:error', {
				user: Number(user) || -1,
				error: `Message content must be betweem 1 and 512 characters.`,
			});
			return;
		}

		const likes = await Promise.all([
			findLike(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: Number(user) || -1,
			}),
			findLike(db_svc, {
				id_user_from: Number(user) || -1,
				id_user_to: client.data.user.id,
			}),
		]);

		if (likes.some((l) => l === null)) {
			client.emit('message:to:error', {
				user: Number(user) || -1,
				error: `You can't send a message to this user.`,
			});
			return;
		}

		const blocks = await Promise.all([
			findBlock(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: Number(user) || -1,
			}),
			findBlock(db_svc, {
				id_user_from: Number(user) || -1,
				id_user_to: client.data.user.id,
			}),
		]);

		if (blocks[0] === null) {
			client.emit('message:to:error', {
				user: Number(user) || -1,
				error: `You have blocked this user.`,
			});
			return;
		}

		let targets = io.to(`user-${client.data.user.id}`);

		try
		{
			const message = await createMessage(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: Number(user) || -1,
				content: String(content),
			});

			if (blocks[1] !== null) {
				targets = targets.to(`user-${user}`);
			}

			targets.emit('message:from', {
				user: Number(user) || -1,
				message,
			});
		}
		catch (err: unknown)
		{
			targets.emit('message:to:error', {
				user: Number(user) || -1,
				error: `Failed to create message.`,
			});
		}
	};
