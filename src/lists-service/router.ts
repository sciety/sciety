import Router from '@koa/router';
import { ownedBy } from './owned-by';
import { Ports } from './ports';
import { ping } from '../http/ping';

export const createRouter = (ports: Ports): Router => {
  const router = new Router();

  router.get('/ping', ping());

  router.get('/owned-by/:groupId', ownedBy(ports));

  return router;
};
