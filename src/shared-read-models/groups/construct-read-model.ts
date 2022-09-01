import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { GroupsReadModel, groupsReadModelReducer } from './read-model';
import { DomainEvent } from '../../domain-events';

export const constructReadModel = (events: ReadonlyArray<DomainEvent>): GroupsReadModel => pipe(
  events,
  RA.reduce(new Map(), groupsReadModelReducer),
);
