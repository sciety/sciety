import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';

export type Adapters = {
  getAllEvents: TE.TaskEither<Error, ReadonlyArray<DomainEvent>>,
  logger: Logger,
};
