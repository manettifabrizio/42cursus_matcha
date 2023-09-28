import { Router }                       from 'express';
import { route as Register }            from './route/register';
import { route as EmailConfirm }        from './route/email-confirm';
import { route as Login }               from './route/login';
import { route as Refresh }             from './route/refresh';
import { route as Logout }              from './route/logout';
import { route as Edit }                from './route/edit';
import { route as ResetPassword }       from './route/reset-password';
import { route as UpdatePassword }      from './route/update-password';
import { middleware as AuthMiddleware } from './middleware';

// Controller ------------------------------------------------------------------
export const controller = Router();

controller.post('/register', Register);
controller.post('/confirm', EmailConfirm);
controller.post('/login', Login);
controller.post('/refresh', Refresh);
controller.post('/logout', Logout);
controller.post('/reset-password', ResetPassword);
controller.post('/update-password', UpdatePassword);

controller.patch('/edit', AuthMiddleware, Edit);
