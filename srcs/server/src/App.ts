require("express-async-errors");

import express     from 'express';
import { Express } from 'express';
import * as http   from 'http';
import * as io     from 'socket.io';

import * as Config from '@/Config';

// Application -----------------------------------------------------------------
const app: Express = express();
const server: http.Server = http.createServer(app);
const socket: io.Server = new io.Server(server,
{
	path: Config.SOCKET_URL,
	serveClient: false,
});

// =============================================================================
// HTTP
// =============================================================================
// Middlewares (Early) ---------------------------------------------------------
import cookieParser from 'cookie-parser';
import { middleware as CsrfMiddleware } from '@/module/security/http/middleware';

app.use(express.static(Config.PUBLIC_PATH));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(Config.COOKIE_SECRET));

app.use(CsrfMiddleware);

// Routes ----------------------------------------------------------------------
import { controller as AppController }   from '@/module/app/http/controller';
import { controller as AuthController }  from '@/module/auth/http/controller';
import { controller as ErrorController } from '@/module/error/http/controller';

app.use('/', AppController);
app.use('/auth', AuthController);

app.use('*', ErrorController); // Note: Must be last

// Middlewares (Late) ----------------------------------------------------------
import { middleware as ErrorMiddleware } from '@/module/error/http/middleware';

app.use(ErrorMiddleware); // Note: Must be last

// =============================================================================
// Socket
// =============================================================================
socket.on('connection', (client) =>
{
	console.log(`Socket: New Client (${client.id}) connected!`);
});

// Export ----------------------------------------------------------------------
export { server };
