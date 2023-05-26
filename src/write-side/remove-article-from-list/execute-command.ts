import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent, DomainEvent } from '../../domain-events';
import { ListResource } from '../resources/list/list-resource';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';
import { replayListResource } from '../resources/list/replay-list-resource';
import { ErrorMessage } from '../../types/error-message';

type Command = {
  articleId: Doi,
  listId: ListId,
};

type ExecuteCommand = (
  command: { listId: ListId, articleId: Doi },
) => (
  events: ReadonlyArray<DomainEvent>,
) => E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

const createAppropriateEvents = (command: Command) => (listResource: ListResource) => pipe(
  listResource.articleIds,
  RA.some((articleId) => articleId.value === command.articleId.value),
  B.fold(
    () => [],
    () => [constructEvent('ArticleRemovedFromList')({ articleId: command.articleId, listId: command.listId })],
  ),
);

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  events,
  replayListResource(command.listId),
  E.map(createAppropriateEvents(command)),
);
