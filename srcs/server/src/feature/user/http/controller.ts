import { Router }           from 'express';
import { route as Profile } from './route/profile';

// Controller ------------------------------------------------------------------
export const controller = Router();

controller.get('/profile', Profile);
