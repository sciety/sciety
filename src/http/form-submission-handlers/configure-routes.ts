import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { CollectedPorts } from '../../infrastructure';
import { requireLoggedInUser } from '../require-logged-in-user';
import { followHandler } from './follow-handler';
import { unfollowHandler } from './unfollow-handler';
import { removeArticleFromListHandler } from './remove-article-from-list-handler';
import { editListDetailsHandler } from './edit-list-details-handler';
import { createListHandler } from './create-list-handler';
import { createAnnotationHandler } from './create-annotation-handler';
import { saveArticleHandler } from './save-article/save-article-handler';

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
