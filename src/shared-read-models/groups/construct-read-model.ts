import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, GroupCreatedEvent, isGroupCreatedEvent } from '../../domain-events';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';

const toGroup = (event: GroupCreatedEvent) => ({
  id: event.groupId,
  name: event.name,
  avatarPath: event.avatarPath,
  descriptionPath: event.descriptionPath,
  shortDescription: event.shortDescription,
  homepage: event.homepage,
  slug: event.slug,
});

type ReadModel = Map<GroupId, Group>;

const recordEvent = (rm: ReadModel, event: DomainEvent) => (
  isGroupCreatedEvent(event)
    ? rm.set(event.groupId, toGroup(event))
    : rm
);

let lastEventParsed = 0;

const readmodel = new Map();

export const constructReadModel = (events: ReadonlyArray<DomainEvent>): ReadModel => pipe(
  events,
  RA.splitAt(lastEventParsed),
  ([_knownEvents, newEvents]) => newEvents,
  RA.reduce(readmodel, recordEvent),
  (model) => {
    lastEventParsed = events.length;
    return model;
  },
);
