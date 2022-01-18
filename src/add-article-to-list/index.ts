import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

type AddArticleToList = (ports: Ports) => (input: unknown) => TE.TaskEither<unknown, void>;

export const addArticleToList: AddArticleToList = () => () => TE.right(undefined);
