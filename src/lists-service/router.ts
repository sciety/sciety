import Router from '@koa/router';
import { ping } from '../http/ping';

export const createRouter = (): Router => {
  const router = new Router();

  router.get('/ping', ping());

  return router;
};
