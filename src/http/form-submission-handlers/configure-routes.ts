import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { CollectedPorts } from '../../infrastructure';
import { requireLoggedInUser } from '../require-logged-in-user';
import { followHandler } from './follow-handler';
import { unfollowHandler } from './unfollow-handler';

export const configureRoutes = (router: Router, adapters: CollectedPorts): void => {
  router.post(
    '/follow',
    bodyParser({ enableTypes: ['form'] }),
    followHandler(adapters),
  );

  router.post(
    '/unfollow',
    bodyParser({ enableTypes: ['form'] }),
    requireLoggedInUser(adapters),
    unfollowHandler(adapters),
  );
};
