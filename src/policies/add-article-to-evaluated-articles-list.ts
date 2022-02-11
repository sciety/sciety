import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addArticleToList, Ports as AddArticleToListPorts } from '../add-article-to-list';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';
import * as Gid from '../types/group-id';

export type Ports = AddArticleToListPorts & {
  logger: Logger,
};

const evaluatedArticlesListIdsByGroupId = {
  [Gid.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2')]: 'ee7e738a-a1f1-465b-807c-132d273ca952',
  [Gid.fromValidatedString('50401e46-b764-47b7-8557-6bb35444b7c8')]: 'dc83aa3b-1691-4356-b697-4257d31a27dc',
  [Gid.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a')]: '4654fd6e-cb00-458f-967b-348b41804927',
  [Gid.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94')]: '49e589f1-531d-4447-92b6-e60b6d1c705e',
  [Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0')]: 'f1561c0f-d247-4e03-934d-52ad9e0aed2f',
  [Gid.fromValidatedString('8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65')]: 'e9606e0e-8fdb-4336-a24a-cc6547d7d950',
  [Gid.fromValidatedString('f97bd177-5cb6-4296-8573-078318755bf2')]: 'f4b96b8b-db49-4b41-9c5b-28d66a83cd70',
  [Gid.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7')]: '5c2e4b99-f5f0-4145-8c87-cadd7a41a1b1',
  [Gid.fromValidatedString('53ed5364-a016-11ea-bb37-0242ac130002')]: 'f981342c-bf38-4dc8-9569-acda5878c07b',
  [Gid.fromValidatedString('316db7d9-88cc-4c26-b386-f067e0f56334')]: 'f3dbc188-e891-4586-b267-c99cf3b3808e',
  [Gid.fromValidatedString('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de')]: 'a4d57b30-b41c-4c9d-81f0-dccd4cd1d099',
  [Gid.fromValidatedString('19b7464a-edbe-42e8-b7cc-04d1eb1f7332')]: '3d69f9e5-6fd2-4266-9cf8-c069bca79617',
  [Gid.fromValidatedString('32025f28-0506-480e-84a0-b47ef1e92ec5')]: '65f661e6-73f9-43e9-9ae6-a84635afb79a',
  [Gid.fromValidatedString('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa')]: 'e764d90c-ffea-4b0e-a63e-d2b5236aa1ed',
  [Gid.fromValidatedString('b90854bf-795c-42ba-8664-8257b9c68b0c')]: '24a60cf9-5f45-43f2-beaf-04139e6f0a0e',
  [Gid.fromValidatedString('7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84')]: 'dd9d166f-6d25-432c-a60f-6df33ca86897',
  [Gid.fromValidatedString('af792cd3-1600-465c-89e5-250c48f793aa')]: 'f2ce72ba-a982-4156-ab34-4a536bd86cb7',
  [Gid.fromValidatedString('b5f31635-d32b-4df9-92a5-0325a1524343')]: 'c5cf299c-2097-4f3d-b362-2475d7bd35cd',
};

export const addArticleToEvaluatedArticlesList = (ports: Ports) => (event: DomainEvent): T.Task<void> => {
  if (!isEvaluationRecordedEvent(event)) {
    return T.of(undefined);
  }
  const listId = evaluatedArticlesListIdsByGroupId[event.groupId];
  if (!listId) {
    ports.logger('error', 'Unknown group id supplied to policy', { event });
    return T.of(undefined);
  }
  const command = {
    articleId: event.articleId.value,
    listId,
  };
  ports.logger('debug', 'Policy attempting to add article to list', { command });
  return pipe(
    command,
    addArticleToList(ports),
    TE.match(
      (errorMessage) => {
        ports.logger('error', 'Failed to add article to list', { errorMessage, command });
      },
      () => { },
    ),
  );
};
