/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { Group } from '../../types/group';
import * as GID from '../../types/group-id';

export type ReadModel = Record<GID.GroupId, Group>;

export const initialState = (): ReadModel => ({});

const toGroup = (event: EventOfType<'GroupJoined'>) => ({
  id: event.groupId,
  name: event.name,
  avatarPath: event.avatarPath,
  descriptionPath: event.descriptionPath,
  shortDescription: event.shortDescription,
  homepage: event.homepage,
  slug: event.slug,
  largeLogoPath: O.fromNullable(event.largeLogoPath),
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('GroupJoined')(event)) {
    readmodel[event.groupId] = toGroup(event);
  }
  if (isEventOfType('GroupDetailsUpdated')(event)) {
    if (event.name !== undefined) {
      readmodel[event.groupId].name = event.name;
    }
    if (event.shortDescription !== undefined) {
      readmodel[event.groupId].shortDescription = event.shortDescription;
    }
    if (event.largeLogoPath !== undefined) {
      readmodel[event.groupId].largeLogoPath = O.some(event.largeLogoPath);
    }
    if (event.avatarPath !== undefined) {
      readmodel[event.groupId].avatarPath = event.avatarPath;
    }
  }
  return readmodel;
};
