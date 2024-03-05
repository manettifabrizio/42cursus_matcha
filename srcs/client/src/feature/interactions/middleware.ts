import {
	connectionEstablished,
	getMessages,
	isUserOnline,
	profileViewed,
	receiveAllMessages,
	receiveLike,
	receiveMessage,
	receiveUnlike,
	sendMessage,
	setUserOnline,
	startConnecting,
	startDisconnecting,
	viewProfile,
} from '@/feature/interactions/store.slice';
import { FromPayload, MessageType } from '@/feature/interactions/types';
import { cookie } from '@/tool/cookie';
import { Middleware } from 'redux';
import { io, Socket } from 'socket.io-client';

function asyncEmit<T, U>(
	socket: Socket,
	emitEventName: string,
	onEventName: string,
	data: U,
): Promise<T> {
	return new Promise(function (resolve, reject) {
		socket.emit(emitEventName, data);
		socket.on(onEventName, (result) => {
			socket.off(onEventName);
			return resolve(result);
		});
		setTimeout(reject, 1000);
	});
}

type MessageListPayload = {
	id_user: number;
	messages: {
		id: number;
		id_user_from: number;
		id_user_to: number;
		content: string;
		created_at: Date;
	}[];
};
type MessageListErrorPayload = {
	id_user: number;
	error: string;
};

const chatMiddleware: Middleware = (store) => {
	let socket: Socket;

	return (next) => async (action) => {
		const isConnectionEstablished =
			socket && store.getState().interactions.isConnected;

		if (startConnecting.match(action)) {
			socket = io('https://localhost:4443', {
				auth: {
					token: cookie('access-token'),
				},
			});

			socket.on('connect', () => {
				store.dispatch(connectionEstablished());
			});

			socket.on('profile:view', (payload: FromPayload) => {
				store.dispatch(profileViewed(payload));
			});

			socket.on('message:list', (payload: MessageListPayload) => {
				store.dispatch(receiveAllMessages(payload));
			});

			socket.on(
				'message:list:error',
				(payload: MessageListErrorPayload) => {
					// console.error(`message:list:error: ${payload.error}`);
					// store.dispatch(receiveAllMessages(payload));
				},
			);

			socket.on('message:from', (payload: MessageType) => {
				store.dispatch(receiveMessage(payload));
			});

			socket.on('message:to:error', (err) => {
				// console.error(`message:error: ${JSON.stringify(err)}`);
			});

			socket.on('like:from', (payload: FromPayload) => {
				store.dispatch(receiveLike(payload));
			});

			socket.on('unlike:from', (payload: FromPayload) => {
				store.dispatch(receiveUnlike(payload));
			});
		}

		if (!isConnectionEstablished) next(action);

		if (getMessages.match(action)) {
			socket.emit('message:list', action.payload);
		}

		if (sendMessage.match(action)) {
			socket.emit('message:to', action.payload);
		}
		if (isUserOnline.match(action)) {
			const payload = await asyncEmit<
				{
					id_user: number;
					online: boolean;
				},
				{
					id_user: number;
				}
			>(socket, 'ping', 'pong', action.payload);
			store.dispatch(setUserOnline(payload));
		}

		if (startDisconnecting.match(action)) {
			socket.disconnect();
		}

		if (viewProfile.match(action)) {
			socket.emit('profile:view', action.payload);
		}

		next(action);
	};
};

export default chatMiddleware;
