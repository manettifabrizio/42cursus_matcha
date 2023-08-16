import { Router } from 'express';

import { route as All } from './route/all';


export const controller = Router();

controller.get('/', All);
