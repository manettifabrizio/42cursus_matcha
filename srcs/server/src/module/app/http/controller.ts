import { Router } from 'express';

import { route as Home } from './route/home';


export const controller = Router();

controller.get('/', Home);
