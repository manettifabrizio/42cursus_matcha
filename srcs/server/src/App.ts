require('express-async-errors');

import type { Express } from 'express';
import express from 'express';
import * as http from 'http';
import * as Config from '@/Config';
import { service as socket_svc } from '@/core/socket/service';

// Application -----------------------------------------------------------------
const app: Express = express();
const server: http.Server = http.createServer(app);
const io = socket_svc.enable(server);

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
import { controller as AuthController } from '@/feature/auth/http/controller';
import { controller as ErrorController } from '@/feature/error/http/controller';
import { controller as SecurityController } from '@/feature/security/http/controller';
import { controller as UserController } from '@/feature/user/http/controller';
import { controller as SearchController } from '@/feature/search/http/controller';

app.use('/auth', AuthController);
app.use('/security', SecurityController);
app.use('/user', UserController);
app.use('/search', SearchController);
app.use('*', ErrorController); // Note: Must be last

// Middlewares (Late) ----------------------------------------------------------
import { middleware as ErrorMiddleware } from '@/feature/error/http/middleware';

app.use(ErrorMiddleware); // Note: Must be last

// =============================================================================
// Socket
// =============================================================================
import { middleware as SocketAuthMiddleware } from '@/feature/auth/socket/middleware';
import { onMessageTo } from '@/feature/chat/socket/event/on-message-to';
import { onMessageList } from '@/feature/chat/socket/event/on-message-list';
import { onStateChange } from '@/feature/auth/socket/event/on-state-change';
import { onPing } from '@/feature/auth/socket/event/on-ping';
import { onProfileView } from '@/feature/activity/socket/event/on-profile-view';

io.use(SocketAuthMiddleware);

io.on('connection', (client) => {
	client.join(`user-${client.data.user.id}`);

	onStateChange(client)();

	client.on('ping', onPing(client));
	client.on('profile:view', onProfileView(client));
	client.on('message:to', onMessageTo(client));
	client.on('message:list', onMessageList(client));
	client.on('disconnecting', onStateChange(client));
	// client.on('disconnect', () => console.log('User is disconnected'));
});

// Export ----------------------------------------------------------------------
export { server };
