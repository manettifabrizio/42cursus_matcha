import type { Socket } from 'socket.io';
import { service as db_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as findLike } from '@/feature/like/use-case/find/query';
import { query as findBlock } from '@/feature/block/use-case/find/query';
import { query as createMessage } from '@/feature/chat/use-case/create/query';

export const onMessageTo: (client: Socket) => (...args: any[]) => void =
	(client) =>
	async ({ id_user, content }) => {
		if (typeof id_user !== 'number' || id_user <= 0) {
			client.emit('message:to:error', {
				id_user,
				error: `Message id_user must be an integer > 0.`,
			});
			return;
		}

		if (
			typeof content !== 'string' ||
			content.length < 1 ||
			content.length > 512
		) {
			client.emit('message:to:error', {
				id_user,
				error: `Message content must be between 1 and 512 characters.`,
			});
			return;
		}

		const likes = await Promise.all([
			findLike(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: id_user,
			}),
			findLike(db_svc, {
				id_user_from: id_user,
				id_user_to: client.data.user.id,
			}),
		]);

		if (likes.some((l) => l === null)) {
			client.emit('message:to:error', {
				id_user,
				error: `You can't send a message to this user.`,
			});
			return;
		}

		const blocks = await Promise.all([
			findBlock(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: id_user,
			}),
			findBlock(db_svc, {
				id_user_from: id_user,
				id_user_to: client.data.user.id,
			}),
		]);

		if (blocks[0] !== null) {
			client.emit('message:to:error', {
				id_user,
				error: `You have blocked this user.`,
			});
			return;
		}

		try {
			const message = await createMessage(db_svc, {
				id_user_from: client.data.user.id,
				id_user_to: id_user,
				content,
			});

			let targets = socket_svc.io().to(`user-${message.id_user_from}`);

			if (blocks[1] === null) {
				targets = targets.to(`user-${message.id_user_to}`);
			}

			targets.emit('message:from', message);
		} catch (err: unknown) {
			client.emit('message:to:error', {
				id_user,
				error: `Failed to create message.`,
			});
		}
	};
