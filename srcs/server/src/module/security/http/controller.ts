import { Router } from 'express';

import { route as Csrf } from './route/csrf';


export const controller = Router();

controller.get('/csrf', Csrf);
