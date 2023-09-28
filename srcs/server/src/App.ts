require("express-async-errors");

import type { Express } from 'express';
import express          from 'express';
import * as http        from 'http';
import * as io          from 'socket.io';
import * as Config      from '@/Config';

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
import { middleware as CsrfMiddleware } from '@/feature/security/http/middleware';

app.use(express.static(Config.PUBLIC_PATH));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(Config.COOKIE_SECRET));

app.use(CsrfMiddleware);

// Routes ----------------------------------------------------------------------
import { controller as AppController }      from '@/feature/app/http/controller';
import { controller as AuthController }     from '@/feature/auth/http/controller';
import { controller as ErrorController }    from '@/feature/error/http/controller';
import { controller as SecurityController } from '@/feature/security/http/controller';
import { controller as UserController }     from '@/feature/user/http/controller';

import { middleware as AuthMiddleware }     from '@/feature/auth/http/middleware';

app.use('/', AppController);
app.use('/auth', AuthController);
app.use('/security', SecurityController);

app.use('/user', AuthMiddleware, UserController);

app.use('*', ErrorController); // Note: Must be last

// Middlewares (Late) ----------------------------------------------------------
import { middleware as ErrorMiddleware } from '@/feature/error/http/middleware';

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
