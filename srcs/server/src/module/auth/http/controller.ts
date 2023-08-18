import { Router }                       from 'express';
import { route as Login }               from './route/login';
import { route as Refresh }             from './route/refresh';
import { route as Register }            from './route/register';
import { route as RegisterConfirm }     from './route/register-confirm';
import { route as EditPassword }        from './route/edit-password';
import { route as Logout }              from './route/logout';
import { middleware as AuthMiddleware } from './middleware';


export const controller = Router();

controller.post('/register', Register);
controller.post('/register-confirm', RegisterConfirm);
controller.post('/login', Login);
controller.post('/refresh', Refresh);
controller.post('/logout', Logout);

controller.patch('/edit-password', AuthMiddleware, EditPassword);
