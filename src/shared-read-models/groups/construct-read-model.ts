import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, GroupJoinedEvent, isGroupJoinedEvent } from '../../domain-events';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';

const toGroup = (event: GroupJoinedEvent) => ({
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
  isGroupJoinedEvent(event)
    ? rm.set(event.groupId, toGroup(event))
    : rm
);

export const constructReadModel = (events: ReadonlyArray<DomainEvent>): ReadModel => pipe(
  events,
  RA.reduce(new Map(), recordEvent),
);
