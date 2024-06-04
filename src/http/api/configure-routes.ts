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
  {
    endpoint: '/api/assign-group-admin',
    handler: configurePostMiddleware(assignUserAsGroupAdminCommandCodec, groupAuthorisation.assign),
  },
  {
    endpoint: '/api/create-user',
    handler: configurePostMiddleware(createUserAccountCommandCodec, userResource.create),
  },
  {
    endpoint: '/api/edit-list-details',
    handler: configurePostMiddleware(editListDetailsCommandCodec, listResource.update),
  },
  {
    endpoint: '/api/erase-evaluation',
    handler: configurePostMiddleware(eraseEvaluationCommandCodec, evaluationResource.erase),
  },
  {
    endpoint: '/api/promote-list',
    handler: configurePostMiddleware(promoteListCommandCodec, listPromotionResource.create),
  },
  {
    endpoint: '/api/remove-list-promotion',
    handler: configurePostMiddleware(removeListPromotionCommandCodec, listPromotionResource.remove),
  },
  {
    endpoint: '/api/record-evaluation-publication',
    handler: configurePostMiddleware(recordEvaluationPublicationCommandCodec, evaluationResource.recordPublication),
  },
  {
    endpoint: '/api/record-evaluation-removal',
    handler: configurePostMiddleware(recordEvaluationRemovalCommandCodec, evaluationResource.recordRemoval),
  },
  {
    endpoint: '/api/remove-article-from-list',
    handler: configurePostMiddleware(removeArticleFromListCommandCodec, listResource.removeArticle),
  },
  {
    endpoint: '/api/update-evaluation',
    handler: configurePostMiddleware(updateEvaluationCommandCodec, evaluationResource.update),
  },
  {
    endpoint: '/api/update-group-details',
    handler: configurePostMiddleware(updateGroupDetailsCommandCodec, groupResource.update),
  },
  {
    endpoint: '/api/update-user-details',
    handler: configurePostMiddleware(updateUserDetailsCommandCodec, userResource.update),
  },
  ];
  config.forEach((route) => {
    router.post(route.endpoint, route.handler);
  });
};
