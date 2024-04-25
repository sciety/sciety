import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { addAFeaturedListHandler } from './add-a-featured-list-handler';
import { createAnnotationHandler } from './create-annotation-handler';
import { createListHandler } from './create-list-handler';
import { editListDetailsHandler } from './edit-list-details-handler';
import { followHandler } from './follow-handler';
import { removeArticleFromListHandler } from './remove-article-from-list-handler';
import { saveArticleHandler } from './save-article-handler';
import { unfollowHandler } from './unfollow-handler';
import { CollectedPorts } from '../../infrastructure';
import { requireLoggedInUser } from '../require-logged-in-user';

export const configureRoutes = (router: Router, adapters: CollectedPorts): void => {
  const formHandlerRoutes = [
    { path: '/forms/edit-list-details', handler: editListDetailsHandler(adapters) },
    { path: '/forms/add-a-featured-list', handler: addAFeaturedListHandler(adapters) },
    { path: '/forms/create-list', handler: createListHandler(adapters) },
    { path: '/forms/create-annotation', handler: createAnnotationHandler(adapters) },
    { path: '/follow', handler: followHandler(adapters) },
  ];

  formHandlerRoutes.forEach((route) => {
    router.post(
      route.path,
      bodyParser({ enableTypes: ['form'] }),
      route.handler,
    );
  });

  const formHandlerRoutesWithAuthentication = [
    { path: '/save-article', handler: saveArticleHandler(adapters) },
    { path: '/forms/remove-article-from-list', handler: removeArticleFromListHandler(adapters) },
    { path: '/unfollow', handler: unfollowHandler(adapters) },
  ];

  formHandlerRoutesWithAuthentication.forEach((route) => {
    router.post(
      route.path,
      bodyParser({ enableTypes: ['form'] }),
      requireLoggedInUser(adapters),
      route.handler,
    );
  });
};
