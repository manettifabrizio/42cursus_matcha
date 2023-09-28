import { Router }                from 'express';
import { route as MeProfile }    from './route/me';
import { route as Edit }         from './route/edit';
import { route as Profile }      from './route/profile';
import { route as Tags }         from './route/tags';
import { route as Like }         from './route/like';
import { route as Likes }        from './route/likes';
import { route as Unlike }       from './route/unlike';
import { route as Block }        from './route/block';
import { route as Blocks }       from './route/blocks';
import { route as Unblock }      from './route/unblock';
import { route as Report }       from './route/report';
import { route as Reports }      from './route/reports';
import { route as Unreport }     from './route/unreport';
import { route as TagAdd }       from './route/tag-add';
import { route as TagRemove }    from './route/tag-remove';

// Controller ------------------------------------------------------------------
export const controller = Router();

controller.get('/me', MeProfile);

controller.patch('/edit', Edit);

// controller.get('/pictures', Pictures);
// controller.post('/picture', AddPicture);
// controller.delete('/picture/:id', RemovePicture);

controller.get('/tags', Tags);
controller.post('/tag', TagAdd);
controller.delete('/tag/:id(\\d+)', TagRemove);

controller.get('/likes', Likes);
controller.post('/:id(\\d+)/like', Like);
controller.delete('/:id(\\d+)/like', Unlike);

controller.get('/blocks', Blocks);
controller.post('/:id(\\d+)/block', Block);
controller.delete('/:id(\\d+)/block', Unblock);

controller.get('/reports', Reports);
controller.post('/:id(\\d+)/report', Report);
controller.delete('/:id(\\d+)/report', Unreport);

controller.get('/:id(\\d+)', Profile);
