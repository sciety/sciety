import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../../src/domain-events';
import { GroupsReadModel, groupsReadModelReducer } from '../../../src/shared-read-models/groups';

export const groupsReadModelFromEvents = (events: ReadonlyArray<DomainEvent>): GroupsReadModel => pipe(
  events,
  RA.reduce(new Map(), groupsReadModelReducer),
);
