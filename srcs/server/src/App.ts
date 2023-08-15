require("express-async-errors");

import * as http   from 'http';
import express     from 'express';
import { Express } from 'express';

import * as Config from '@/Config';

// Application -----------------------------------------------------------------
const app: Express = express();
const server: http.Server = http.createServer(app);

// Middlewares (Early) ---------------------------------------------------------
import cookieParser from 'cookie-parser';

app.use(express.static(Config.PUBLIC_PATH));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(Config.COOKIE_SECRET));

// Routes ----------------------------------------------------------------------
import { controller as AppController }   from '@/module/app/controller';
import { controller as AuthController }  from '@/module/auth/controller';
import { controller as ErrorController } from '@/module/error/controller';

app.use('/', AppController);
app.use('/auth', AuthController);

app.use('*', ErrorController); // Note: Must be last

// Middlewares (Late) ----------------------------------------------------------
import { middleware as ErrorMiddleware } from './module/error/middleware';

app.use(ErrorMiddleware); // Note: Must be last

// Export ----------------------------------------------------------------------
export { server };
