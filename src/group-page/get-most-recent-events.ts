import * as T from 'fp-ts/Task';
import {
  DomainEvent,
} from '../types/domain-events';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;
