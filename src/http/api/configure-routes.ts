import Router from '@koa/router';
import { createConfigurePostMiddleware } from './create-configure-post-middleware';
import { CollectedPorts } from '../../infrastructure';
import {
  addArticleToListCommandCodec,
  addGroupCommandCodec,
  assignUserAsGroupAdminCommandCodec,
  editListDetailsCommandCodec,
  eraseEvaluationCommandCodec,
  promoteListCommandCodec,
  recordEvaluationPublicationCommandCodec,
  recordEvaluationRemovalCommandCodec,
  removeArticleFromListCommandCodec,
  removeListPromotionCommandCodec,
  updateEvaluationCommandCodec,
  updateGroupDetailsCommandCodec,
  updateUserDetailsCommandCodec,
} from '../../write-side/commands';
import { createUserAccountCommandCodec } from '../../write-side/commands/create-user-account';
import * as evaluationResource from '../../write-side/resources/evaluation';
import * as groupResource from '../../write-side/resources/group';
import * as groupAuthorisation from '../../write-side/resources/group-authorisation';
import * as listResource from '../../write-side/resources/list';
import * as listPromotionResource from '../../write-side/resources/list-promotion';
import * as userResource from '../../write-side/resources/user';
import { ownedBy } from '../owned-by-api';

export const configureRoutes = (router: Router, adapters: CollectedPorts, expectedToken: string): void => {
  router.get('/api/lists/owned-by/:ownerId', ownedBy(adapters));

  const configurePostMiddleware = createConfigurePostMiddleware(adapters, expectedToken);

  const config = [{
    endpoint: '/api/add-article-to-list',
    handler: configurePostMiddleware(addArticleToListCommandCodec, listResource.addArticle),
  },
  {
    endpoint: '/api/add-group',
    handler: configurePostMiddleware(addGroupCommandCodec, groupResource.create),
  },
  ];
  config.forEach((route) => {
    router.post(route.endpoint, route.handler);
  });

  router.post('/api/assign-group-admin', configurePostMiddleware(assignUserAsGroupAdminCommandCodec, groupAuthorisation.assign));

  router.post(
    '/api/create-user',
    configurePostMiddleware(createUserAccountCommandCodec, userResource.create),
  );

  router.post('/api/edit-list-details', configurePostMiddleware(editListDetailsCommandCodec, listResource.update));

  router.post('/api/erase-evaluation', configurePostMiddleware(eraseEvaluationCommandCodec, evaluationResource.erase));

  router.post('/api/promote-list', configurePostMiddleware(promoteListCommandCodec, listPromotionResource.create));

  router.post('/api/remove-list-promotion', configurePostMiddleware(removeListPromotionCommandCodec, listPromotionResource.remove));

  router.post('/api/record-evaluation-publication', configurePostMiddleware(recordEvaluationPublicationCommandCodec, evaluationResource.recordPublication));

  router.post('/api/record-evaluation-removal', configurePostMiddleware(recordEvaluationRemovalCommandCodec, evaluationResource.recordRemoval));

  router.post('/api/remove-article-from-list', configurePostMiddleware(removeArticleFromListCommandCodec, listResource.removeArticle));

  router.post('/api/update-evaluation', configurePostMiddleware(updateEvaluationCommandCodec, evaluationResource.update));

  router.post('/api/update-group-details', configurePostMiddleware(updateGroupDetailsCommandCodec, groupResource.update));

  router.post('/api/update-user-details', configurePostMiddleware(updateUserDetailsCommandCodec, userResource.update));
};
