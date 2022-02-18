import Router from '@koa/router';
import { Adapters } from './adapters';
import { ownedBy } from './owned-by';
import { ping } from '../http/ping';

export const createRouter = (adapters: Adapters): Router => {
  const router = new Router();

  router.get('/ping', ping());

  router.get('/owned-by/:groupId', ownedBy(adapters));

  return router;
};
