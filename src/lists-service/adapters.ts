import * as T from 'fp-ts/Task';
import { DomainEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';

export type Adapters = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  logger: Logger,
};
