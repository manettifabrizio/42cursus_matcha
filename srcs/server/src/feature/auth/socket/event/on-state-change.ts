import type { Socket } from 'socket.io';
import { service as db_svc } from '@/core/database/service';
import { query as editUser } from '@/feature/user/use-case/edit/query';

export const onStateChange: (client: Socket) => (...args: any[]) => void =
	(client) => async () => {
		editUser(db_svc, {
			id: client.data.user.id,
			last_seen_at: new Date(),
		}).catch((err) => {
			// console.error(err); // Todo: Remove
		});
	};
