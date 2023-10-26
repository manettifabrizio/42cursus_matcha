import * as io from 'socket.io';
import * as http from 'http';

// Type ------------------------------------------------------------------------
export interface SocketService {
	enable: (http_server: http.Server) => io.Server;
	io: () => io.Server;
}
