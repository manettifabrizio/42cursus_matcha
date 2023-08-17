import { Router } from 'express';

import { route as Login }    from './route/login';
import { route as Refresh }  from './route/refresh';
import { route as Register } from './route/register';


export const controller = Router();

controller.post('/register', Register);
controller.post('/login', Login);
controller.post('/refresh',  Refresh);
