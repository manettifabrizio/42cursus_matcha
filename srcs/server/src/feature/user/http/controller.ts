import { Router }             from 'express';
import { service as UploadService }                    from '@/core/upload/service';
import { middleware as NotBlockedMiddleware }          from '@/feature/block/http/middleware';
import { middleware as NotReportedMiddleware }         from '@/feature/report/http/middleware';
import { middleware as HasCompletedProfileMiddleware } from '@/feature/user/http/middleware';
import { route as Me }            from './route/me';
import { route as Edit }          from './route/edit';
import { route as Profile }       from './route/profile';
import { route as Pictures }      from './route/picture/get';
import { route as AddPicture }    from './route/picture/add';
import { route as RemovePicture } from './route/picture/remove';
import { route as Tags }          from './route/tag/get';
import { route as TagAdd }        from './route/tag/add';
import { route as TagRemove }     from './route/tag/remove';
import { route as Likes }         from './route/like/get';
import { route as Like }          from './route/like/create';
import { route as Unlike }        from './route/like/delete';
import { route as Blocks }        from './route/block/get';
import { route as Block }         from './route/block/create';
import { route as Unblock }       from './route/block/delete';
import { route as Reports }       from './route/report/get';
import { route as Report }        from './route/report/create';
import { route as Unreport }      from './route/report/delete';

// Controller ------------------------------------------------------------------
export const controller = Router();

controller.get('/me', Me);
controller.get('/:id(\\d+)', HasCompletedProfileMiddleware, Profile);
controller.patch('/edit', Edit);

controller.get('/:id?(\\d+)/pictures', HasCompletedProfileMiddleware, Pictures);
controller.post('/picture', UploadService.single('picture'), AddPicture);
controller.delete('/picture/:id', RemovePicture);

controller.get('/:id?(\\d+)/tags', HasCompletedProfileMiddleware, Tags);
controller.post('/tag', TagAdd);
controller.delete('/tag/:id(\\d+)', TagRemove);

controller.get('/likes', Likes);
controller.post('/:id(\\d+)/like',
	HasCompletedProfileMiddleware,
	NotReportedMiddleware,
	NotBlockedMiddleware,
	Like
);
controller.delete('/:id(\\d+)/like', Unlike);

controller.get('/blocks', Blocks);
controller.post('/:id(\\d+)/block', HasCompletedProfileMiddleware, Block);
controller.delete('/:id(\\d+)/block', Unblock);

controller.get('/reports', Reports);
controller.post('/:id(\\d+)/report', HasCompletedProfileMiddleware, Report);
controller.delete('/:id(\\d+)/report', Unreport);
