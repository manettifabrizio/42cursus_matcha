import {
	connectionEstablished,
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
import { Message } from '@/feature/interactions/types';
import { cookie } from '@/tool/cookie';
import { Middleware } from 'redux';
import { io, Socket } from 'socket.io-client';

function asyncEmit<T>(
	socket: Socket,
	emitEventName: string,
	onEventName: string,
	data: any,
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

type FromPayload = { id_user_from: number; username: string };

const chatMiddleware: Middleware = (store) => {
	let socket: Socket;

	return (next) => async (action) => {
		const isConnectionEstablished =
			socket && store.getState().interactions.isConnected;

		if (startConnecting.match(action)) {
			socket = io('https://localhost', {
				auth: {
					token: cookie('access-token'),
				},
			});

			socket.on('connect', () => {
				console.log('Socket is connected');
				store.dispatch(connectionEstablished());
			});

			socket.on('profile:view', (payload: FromPayload) => {
				store.dispatch(profileViewed(payload));
			});

			socket.on('message:list', (messages: Message[]) => {
				store.dispatch(receiveAllMessages({ messages }));
			});

			socket.on('message:list:error', (messages: Message[]) => {
				store.dispatch(receiveAllMessages({ messages }));
			});

			socket.on('message:from', (message: Message) => {
				store.dispatch(receiveMessage({ message }));
			});

			socket.on('message:to:error', (err) => {
				console.error(`message:error: ${err}`);
			});

			socket.on('like:from', (payload: FromPayload) => {
				store.dispatch(receiveLike(payload));
			});

			socket.on('unlike:from', (payload: FromPayload) => {
				store.dispatch(receiveUnlike(payload));
			});
		}

		if (sendMessage.match(action) && isConnectionEstablished)
			socket.emit('message:to', action.payload.content);

		if (isUserOnline.match(action) && isConnectionEstablished) {
			const payload = await asyncEmit<{
				id_user: number;
				online: boolean;
			}>(socket, 'ping', 'pong', action.payload);
			store.dispatch(setUserOnline(payload));
		}

		if (startDisconnecting.match(action) && isConnectionEstablished) {
			socket.disconnect();
		}

		if (viewProfile.match(action) && isConnectionEstablished) {
			socket.emit('profile:view', action.payload);
		}

		next(action);
	};
};

export default chatMiddleware;
