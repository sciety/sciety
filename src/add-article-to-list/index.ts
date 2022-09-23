import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { ListAggregate } from './list-aggregate';
import { validateInputShape } from './validate-input-shape';
import { DomainEvent, isArticleAddedToListEvent } from '../domain-events';
import { CommitEvents } from '../shared-ports';
import { CommandResult } from '../types/command-result';
import { ListId } from '../types/list-id';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

const listAggregateByListId = (listId: ListId) => (events: ReadonlyArray<DomainEvent>): ListAggregate => pipe(
  events,
  RA.filter(isArticleAddedToListEvent),
  RA.filter((event) => event.listId === listId),
  RA.map((event) => event.articleId),
  (articleIds) => ({ articleIds }),
);

type AddArticleToListCommandHandler = (
  ports: Ports
) => (
  input: unknown,
  date?: Date
) => TE.TaskEither<string, CommandResult>;

export const addArticleToListCommandHandler: AddArticleToListCommandHandler = (
  ports,
) => (
  input,
  date = new Date(),
) => pipe(
  input,
  validateInputShape,
  TE.fromEither,
  TE.chainW((command) => pipe(
    ports.getAllEvents,
    T.map(listAggregateByListId(command.listId)),
    T.map(executeCommand(command, date)),
  )),
  TE.chainTaskK(ports.commitEvents),
);
