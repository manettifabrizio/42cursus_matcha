import { Router }            from 'express';
import { route as NotFound } from './route/not-found';


export const controller = Router();

controller.get('/', NotFound);
