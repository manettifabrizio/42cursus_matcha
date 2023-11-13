import { Router } from 'express';
import { middleware as AuthMiddleware } from '@/feature/auth/http/middleware';
import { middleware as HasCompletedProfileMiddleware } from '@/feature/user/http/middleware';
import { route as Search } from './route/get';

// Controller ------------------------------------------------------------------
export const controller = Router();

controller.use(AuthMiddleware);
controller.use(HasCompletedProfileMiddleware);

controller.get('/:recommandation(recommandation)?', Search);
