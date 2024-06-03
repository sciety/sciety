import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { addAFeaturedListHandler } from './add-a-featured-list-handler';
import { createAnnotationHandler } from './create-annotation-handler';
import { createListHandler } from './create-list-handler';
import { editListDetailsHandler } from './edit-list-details-handler';
import { followHandler } from './follow-handler';
import { removeArticleFromListHandler } from './remove-article-from-list-handler';
import { removeListPromotionHandler } from './remove-list-promotion-handler';
import { saveArticleHandler } from './save-article-handler';
import {
  pathToSubmitEditListDetails,
  pathToSubmitAddAFeaturedList,
  pathToSubmitCreateList,
  pathToSubmitCreateAnnotation,
  pathToSubmitFollow,
  pathToSubmitSaveArticle,
  pathToSubmitRemoveListPromotion,
} from './submit-paths';
import { unfollowHandler } from './unfollow-handler';
import { CollectedPorts } from '../../infrastructure';
import { requireLoggedInUser } from '../require-logged-in-user';

export const configureRoutes = (router: Router, adapters: CollectedPorts): void => {
  const formHandlerRoutes = [
    { path: pathToSubmitEditListDetails(), handler: editListDetailsHandler(adapters) },
    { path: pathToSubmitAddAFeaturedList(), handler: addAFeaturedListHandler(adapters) },
    { path: pathToSubmitRemoveListPromotion(), handler: removeListPromotionHandler(adapters) },
    { path: pathToSubmitCreateList(), handler: createListHandler(adapters) },
    { path: pathToSubmitCreateAnnotation(), handler: createAnnotationHandler(adapters) },
    { path: pathToSubmitFollow(), handler: followHandler(adapters) },
    { path: pathToSubmitSaveArticle(), handler: saveArticleHandler(adapters) },
  ];

  formHandlerRoutes.forEach((route) => {
    router.post(
      route.path,
      bodyParser({ enableTypes: ['form'] }),
      route.handler,
    );
  });

  const formHandlerRoutesWithAuthentication = [
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
