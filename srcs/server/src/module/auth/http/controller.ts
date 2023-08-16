import { Router } from 'express';

import { route as Register } from './route/register';


export const controller = Router();

controller.post('/register', Register);
