/* eslint-disable no-param-reassign */
import {
  DomainEvent, GroupJoinedEvent, isEventOfType, isGroupJoinedEvent,
} from '../../domain-events';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';

export type ReadModel = Record<GroupId, Group>;

export const initialState = (): ReadModel => ({});

const toGroup = (event: GroupJoinedEvent) => ({
  id: event.groupId,
  name: event.name,
  avatarPath: event.avatarPath,
  descriptionPath: event.descriptionPath,
  shortDescription: event.shortDescription,
  homepage: event.homepage,
  slug: event.slug,
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isGroupJoinedEvent(event)) {
    readmodel[event.groupId] = toGroup(event);
  }
  if (isEventOfType('GroupDetailsUpdated')(event)) {
    if (event.name !== undefined) {
      readmodel[event.groupId].name = event.name;
    }
    if (event.shortDescription !== undefined) {
      readmodel[event.groupId].shortDescription = event.shortDescription;
    }
  }
  return readmodel;
};
