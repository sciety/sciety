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
  } else if (event.groupId === GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2')) {
    largeLogoPath = O.some('/static/images/home-page/biophysics-colab.png');
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
  }
  return readmodel;
};
