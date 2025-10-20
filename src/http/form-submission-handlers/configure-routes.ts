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
import { startBonfireDiscussionHandler } from './start-bonfire-discussion-handler';
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
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import { DependenciesForCommands } from '../../write-side';
import { requireLoggedInUser } from '../require-logged-in-user';

type Dependencies = DependenciesForCommands & DependenciesForViews;

export const configureRoutes = (router: Router, dependencies: Dependencies): void => {
  const formHandlerRoutes = [
    { path: pathToSubmitEditListDetails(), handler: editListDetailsHandler(dependencies) },
    { path: pathToSubmitAddAFeaturedList(), handler: addAFeaturedListHandler(dependencies) },
    { path: pathToSubmitRemoveListPromotion(), handler: removeListPromotionHandler(dependencies) },
    { path: pathToSubmitCreateList(), handler: createListHandler(dependencies) },
    { path: pathToSubmitCreateAnnotation(), handler: createAnnotationHandler(dependencies) },
    { path: pathToSubmitFollow(), handler: followHandler(dependencies) },
    { path: pathToSubmitSaveArticle(), handler: saveArticleHandler(dependencies) },
  ];

  formHandlerRoutes.forEach((route) => {
    router.post(
      route.path,
      bodyParser({ enableTypes: ['form'] }),
      route.handler,
    );
  });

  const formHandlerRoutesWithAuthentication = [
    { path: '/forms/remove-article-from-list', handler: removeArticleFromListHandler(dependencies) },
    { path: '/forms/start-bonfire-discussion', handler: startBonfireDiscussionHandler(dependencies) },
    { path: '/unfollow', handler: unfollowHandler(dependencies) },
  ];

  formHandlerRoutesWithAuthentication.forEach((route) => {
    router.post(
      route.path,
      bodyParser({ enableTypes: ['form'] }),
      requireLoggedInUser(),
      route.handler,
    );
  });
};
