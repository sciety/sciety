import * as T from 'fp-ts/Task';
import { DomainEvent } from '../domain-events/index.js';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;
