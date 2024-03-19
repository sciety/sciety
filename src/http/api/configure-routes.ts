import Router from '@koa/router';
import { CollectedPorts } from '../../infrastructure';
import {
  addArticleToListCommandCodec,
  addGroupCommandCodec,
  editListDetailsCommandCodec,
  eraseEvaluationCommandCodec,
  recordEvaluationPublicationCommandCodec,
  recordEvaluationRemovalCommandCodec,
  removeArticleFromListCommandCodec,
  updateEvaluationCommandCodec,
  updateGroupDetailsCommandCodec,
  updateUserDetailsCommandCodec,
} from '../../write-side/commands';
import { createUserAccountCommandCodec } from '../../write-side/commands/create-user-account';
import { createApiRouteForResourceAction } from '../create-api-route-for-resource-action';
import { ownedBy } from '../owned-by-api';
import * as evaluationResource from '../../write-side/resources/evaluation';
import * as groupResource from '../../write-side/resources/group';
import * as listResource from '../../write-side/resources/list';
import * as userResource from '../../write-side/resources/user';

export const configureRoutes = (router: Router, adapters: CollectedPorts, expectedToken: string): void => {
  router.get('/api/lists/owned-by/:ownerId', ownedBy(adapters));

  const resourceActionApiMiddleware = createApiRouteForResourceAction(adapters, expectedToken);

  router.post('/api/add-article-to-list', resourceActionApiMiddleware(addArticleToListCommandCodec, listResource.addArticle));

  router.post('/api/add-group', resourceActionApiMiddleware(addGroupCommandCodec, groupResource.create));

  router.post(
    '/api/create-user',
    resourceActionApiMiddleware(createUserAccountCommandCodec, userResource.create),
  );

  router.post('/api/edit-list-details', resourceActionApiMiddleware(editListDetailsCommandCodec, listResource.update));

  router.post('/api/erase-evaluation', resourceActionApiMiddleware(eraseEvaluationCommandCodec, evaluationResource.erase));

  router.post('/api/record-evaluation-publication', resourceActionApiMiddleware(recordEvaluationPublicationCommandCodec, evaluationResource.recordPublication));

  router.post('/api/record-evaluation-removal', resourceActionApiMiddleware(recordEvaluationRemovalCommandCodec, evaluationResource.recordRemoval));

  router.post('/api/remove-article-from-list', resourceActionApiMiddleware(removeArticleFromListCommandCodec, listResource.removeArticle));

  router.post('/api/update-evaluation', resourceActionApiMiddleware(updateEvaluationCommandCodec, evaluationResource.update));

  router.post('/api/update-group-details', resourceActionApiMiddleware(updateGroupDetailsCommandCodec, groupResource.update));

  router.post('/api/update-user-details', resourceActionApiMiddleware(updateUserDetailsCommandCodec, userResource.update));
};
