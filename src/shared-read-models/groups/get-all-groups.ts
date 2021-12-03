import { pipe } from 'fp-ts/function';
import { constructReadModel } from './construct-read-model';
import { DomainEvent } from '../../domain-events';
import { Group } from '../../types/group';

export const getAllGroups = (events: ReadonlyArray<DomainEvent>): ReadonlyArray<Group> => pipe(
  events,
  constructReadModel,
  (map) => Array.from(map.values()),
);
