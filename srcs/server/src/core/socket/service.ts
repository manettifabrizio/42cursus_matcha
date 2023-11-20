import type { SocketService } from './types';
import * as io from 'socket.io';
import * as Config from '@/Config';

// Variable --------------------------------------------------------------------
let server: io.Server;

// Function --------------------------------------------------------------------
const enable: SocketService['enable'] = (http_server) => {
	server ??= new io.Server(http_server, {
		path: Config.SOCKET_URL,
		serveClient: false,
	});

	return server;
};

// Service ---------------------------------------------------------------------
export const service: SocketService = {
	enable,
	io: () => server,
};
