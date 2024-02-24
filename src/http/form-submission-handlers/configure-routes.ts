import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { CollectedPorts } from '../../collected-ports.js';
import { requireLoggedInUser } from '../require-logged-in-user.js';
import { followHandler } from './follow-handler.js';
import { unfollowHandler } from './unfollow-handler.js';
import { saveArticleHandler } from './save-article-handler.js';
import { removeArticleFromListHandler } from './remove-article-from-list-handler.js';
import { editListDetailsHandler } from './edit-list-details-handler.js';
import { createListHandler } from './create-list-handler.js';
import { createAnnotationHandler } from './create-annotation-handler.js';

export const configureRoutes = (router: Router, adapters: CollectedPorts): void => {
  router.post(
    '/save-article',
    bodyParser({ enableTypes: ['form'] }),
    requireLoggedInUser(adapters),
    saveArticleHandler(adapters),
  );

  router.post(
    '/forms/remove-article-from-list',
    bodyParser({ enableTypes: ['form'] }),
    requireLoggedInUser(adapters),
    removeArticleFromListHandler(adapters),
  );

  router.post(
    '/forms/edit-list-details',
    bodyParser({ enableTypes: ['form'] }),
    editListDetailsHandler(adapters),
  );

  router.post(
    '/forms/create-list',
    bodyParser({ enableTypes: ['form'] }),
    createListHandler(adapters),
  );

  router.post(
    '/annotations/create-annotation',
    bodyParser({ enableTypes: ['form'] }),
    createAnnotationHandler(adapters),
  );

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
