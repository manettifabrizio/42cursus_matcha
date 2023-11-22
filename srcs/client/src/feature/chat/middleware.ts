import {
	connectionEstablished,
	isUserOnline,
	receiveAllMessages,
	receiveMessage,
	sendMessage,
	setUserOnline,
	startConnecting,
	startDisconnecting,
} from '@/feature/chat/store.slice';
import { Message } from '@/feature/chat/types';
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

const chatMiddleware: Middleware = (store) => {
	let socket: Socket;

	return (next) => async (action) => {
		const isConnectionEstablished =
			socket && store.getState().chat.isConnected;

		console.log('chatMiddleware', action);

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
		}

		if (sendMessage.match(action) && isConnectionEstablished)
			socket.emit('message:to', action.payload.content);

		if (isUserOnline.match(action) && isConnectionEstablished) {
			const payload = await asyncEmit<{
				user: number;
				is_online: boolean;
			}>(socket, 'ping', 'pong', action.payload);
			store.dispatch(setUserOnline(payload));
		}

		if (startDisconnecting.match(action) && isConnectionEstablished) {
            
			socket.disconnect();
		}

		next(action);
	};
};

export default chatMiddleware;
