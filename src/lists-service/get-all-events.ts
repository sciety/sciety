import * as T from 'fp-ts/Task';
import { DomainEvent } from '../domain-events';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const getAllEvents: GetAllEvents = T.of([]);
