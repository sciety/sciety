import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { validateInputShape } from './validate-input-shape';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

type AddArticleToList = (ports: Ports) => (input: unknown) => TE.TaskEither<unknown, void>;

export const addArticleToList: AddArticleToList = () => (input) => pipe(
  input,
  validateInputShape,
  T.of,
  TE.map(() => undefined),
);
