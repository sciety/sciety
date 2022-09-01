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

export type GroupsReadModel = Map<GroupId, Group>;

export const groupsReadModelReducer = (rm: GroupsReadModel, event: DomainEvent): GroupsReadModel => (
  isGroupCreatedEvent(event)
    ? rm.set(event.groupId, toGroup(event))
    : rm
);
