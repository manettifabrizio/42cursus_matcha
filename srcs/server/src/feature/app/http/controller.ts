import { Router }        from 'express';
import { route as Home } from './route/home';

// Controller ------------------------------------------------------------------
export const controller = Router();

controller.get('/', Home);
