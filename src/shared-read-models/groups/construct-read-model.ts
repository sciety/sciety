import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, GroupCreatedEvent } from '../../domain-events';
import { isGroupCreatedEvent } from '../../domain-events/type-guards';
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
  isAutomated: event.isAutomated,
});

type ReadModel = Map<GroupId, Group>;

const recordEvent = (rm: ReadModel, event: DomainEvent) => (
  isGroupCreatedEvent(event)
    ? rm.set(event.groupId, toGroup(event))
    : rm
);

export const constructReadModel = (events: ReadonlyArray<DomainEvent>): ReadModel => pipe(
  events,
  RA.reduce(new Map(), recordEvent),
);
