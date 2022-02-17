import Router from '@koa/router';
import { ownedBy } from './owned-by';
import { ping } from '../http/ping';

export const createRouter = (): Router => {
  const router = new Router();

  router.get('/ping', ping());

  router.get('/owned-by/:groupId', ownedBy);

  return router;
};
