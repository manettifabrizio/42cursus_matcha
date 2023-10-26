import type { Socket } from 'socket.io';
import { service as db_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as findLike } from '@/feature/like/use-case/find/query';
import { query as findBlock } from '@/feature/block/use-case/find/query';

export const onMessageTo: (client: Socket) => (...args: any[]) => void =
	(client) =>
	async ({ content, to }) => {
		const io = socket_svc.io();

		const likes = await Promise.all([
			findLike(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: Number(to) || -1,
			}),
			findLike(db_svc, {
				id_user_from: Number(to) || -1,
				id_user_to: client.data.user.id,
			}),
		]);

		if (likes.some((l) => l === null)) {
			client.emit(
				'message:error',
				`You can't send a message to this user.`,
			);
			return;
		}

		const blocks = await Promise.all([
			findBlock(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: Number(to) || -1,
			}),
			findBlock(db_svc, {
				id_user_from: Number(to) || -1,
				id_user_to: client.data.user.id,
			}),
		]);

		if (blocks[0] === null) {
			client.emit('message:error', `You have blocked this user.`);
			return;
		}

		// Todo: Persistent message ?

		let targets = io.to(`user-${client.data.user.id}`);

		if (blocks[1] !== null) {
			targets = targets.to(`user-${to}`);
		}

		targets.emit('message:from', {
			content,
			from: client.data.user.id,
			to,
		});
	};
