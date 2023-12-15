import { Router } from 'express';
import { service as UploadService } from '@/core/upload/service';
import { middleware as AuthMiddleware } from '@/feature/auth/http/middleware';
import { middleware as NotBlockedMiddleware } from '@/feature/block/http/middleware';
import { middleware as NotReportedMiddleware } from '@/feature/report/http/middleware';
import { middleware as HasCompletedProfileMiddleware } from '@/feature/user/http/middleware';
import { route as UserEdit } from './route/edit';
import { route as UserGet } from './route/get';
import { route as UserProfile } from './route/profile';
import { route as Pictures } from './route/picture/get';
import { route as PictureAdd } from './route/picture/add';
import { route as PictureRemove } from './route/picture/remove';
import { route as Tags } from './route/tag/get';
import { route as TagAdd } from './route/tag/add';
import { route as TagRemove } from './route/tag/remove';
import { route as Likes } from './route/like/get';
import { route as Like } from './route/like/create';
import { route as Unlike } from './route/like/delete';
import { route as Blocks } from './route/block/get';
import { route as Block } from './route/block/create';
import { route as Unblock } from './route/block/delete';
import { route as Reports } from './route/report/get';
import { route as Report } from './route/report/create';
import { route as Unreport } from './route/report/delete';
import { route as Activities } from './route/activity/get';

// Controller ------------------------------------------------------------------
export const controller = Router();

controller.use(AuthMiddleware);

controller.patch('/edit', UserEdit);

controller.post('/pictures', UploadService.single('picture'), PictureAdd);
controller.post('/tags', TagAdd);

controller.get('/:id_user(\\d+)?/profile', UserProfile);

controller.get('/:id_user(\\d+)?', UserGet);
controller.get('/:id_user(\\d+)?/pictures', Pictures);
controller.get('/:id_user(\\d+)?/tags', Tags);

controller.get('/likes', Likes); // Todo: Pagination
controller.get('/blocks', Blocks); // Todo: Pagination
controller.get('/reports', Reports); // Todo: Pagination
controller.get('/activities', Activities); // Todo: Pagination

controller.delete('/pictures/:id_picture(\\d+)', PictureRemove);

controller.use(HasCompletedProfileMiddleware);

controller.post('/:id_user(\\d+)/block', Block);
controller.post('/:id_user(\\d+)/report', Report);

controller.delete('/:id_user(\\d+)/like', Unlike);
controller.delete('/:id_user(\\d+)/block', Unblock);
controller.delete('/:id_user(\\d+)/report', Unreport);

controller.delete('/tags/:id_tag(\\d+)', TagRemove);

controller.use(NotReportedMiddleware);
controller.use(NotBlockedMiddleware);

controller.post('/:id_user(\\d+)/like', Like);
