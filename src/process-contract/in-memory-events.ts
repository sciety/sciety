import * as A from 'fp-ts/Array';
import { byDate, byUuid, DomainEvent } from '../domain-events';

export type InMemoryEvents = Array<DomainEvent>;

export const sortEvents = A.sortBy([byDate, byUuid]);
