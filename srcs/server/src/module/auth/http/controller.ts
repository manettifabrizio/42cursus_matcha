import { Router }                       from 'express';
import { route as Register }            from './route/register';
import { route as Confirm }             from './route/confirm';
import { route as Login }               from './route/login';
import { route as Refresh }             from './route/refresh';
import { route as Logout }              from './route/logout';
import { route as EditEmail }           from './route/edit-email';
import { route as EditPassword }        from './route/edit-password';
import { middleware as AuthMiddleware } from './middleware';


export const controller = Router();

controller.post('/register', Register);
controller.post('/confirm', Confirm);
controller.post('/login', Login);
controller.post('/refresh', Refresh);
controller.post('/logout', Logout);

controller.patch('/edit-email', AuthMiddleware, EditEmail);
controller.patch('/edit-password', AuthMiddleware, EditPassword);
