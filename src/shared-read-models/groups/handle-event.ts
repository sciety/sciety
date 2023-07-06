/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { Group } from '../../types/group';
import * as GID from '../../types/group-id';

export type ReadModel = Record<GID.GroupId, Group>;

export const initialState = (): ReadModel => ({});

const toGroup = (event: EventOfType<'GroupJoined'>) => {
  let largeLogoPath: O.Option<string> = O.none;
  if (event.groupId === GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0')) {
    largeLogoPath = O.some('/static/images/article-page/elife-logo-sm.svg');
  } else if (event.groupId === GID.fromValidatedString('f7a7aec3-8b1c-4b81-b098-f3f2e4eefe58')) {
    largeLogoPath = O.some('/static/images/home-page/gigabyte.png');
  }
  return {
    id: event.groupId,
    name: event.name,
    avatarPath: event.avatarPath,
    descriptionPath: event.descriptionPath,
    shortDescription: event.shortDescription,
    homepage: event.homepage,
    slug: event.slug,
    largeLogoPath,
  };
};

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
  }
  return readmodel;
};
