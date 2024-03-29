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
import { createConfigurePostMiddleware } from './create-configure-post-middleware';
import { ownedBy } from '../owned-by-api';
import * as evaluationResource from '../../write-side/resources/evaluation';
import * as groupResource from '../../write-side/resources/group';
import * as listResource from '../../write-side/resources/list';
import * as userResource from '../../write-side/resources/user';

export const configureRoutes = (router: Router, adapters: CollectedPorts, expectedToken: string): void => {
  router.get('/api/lists/owned-by/:ownerId', ownedBy(adapters));

  const configurePostMiddleware = createConfigurePostMiddleware(adapters, expectedToken);

  router.post('/api/add-article-to-list', configurePostMiddleware(addArticleToListCommandCodec, listResource.addArticle));

  router.post('/api/add-group', configurePostMiddleware(addGroupCommandCodec, groupResource.create));

  router.post(
    '/api/create-user',
    configurePostMiddleware(createUserAccountCommandCodec, userResource.create),
  );

  router.post('/api/edit-list-details', configurePostMiddleware(editListDetailsCommandCodec, listResource.update));

  router.post('/api/erase-evaluation', configurePostMiddleware(eraseEvaluationCommandCodec, evaluationResource.erase));

  router.post('/api/record-evaluation-publication', configurePostMiddleware(recordEvaluationPublicationCommandCodec, evaluationResource.recordPublication));

  router.post('/api/record-evaluation-removal', configurePostMiddleware(recordEvaluationRemovalCommandCodec, evaluationResource.recordRemoval));

  router.post('/api/remove-article-from-list', configurePostMiddleware(removeArticleFromListCommandCodec, listResource.removeArticle));

  router.post('/api/update-evaluation', configurePostMiddleware(updateEvaluationCommandCodec, evaluationResource.update));

  router.post('/api/update-group-details', configurePostMiddleware(updateGroupDetailsCommandCodec, groupResource.update));

  router.post('/api/update-user-details', configurePostMiddleware(updateUserDetailsCommandCodec, userResource.update));
};
