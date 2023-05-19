import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { toErrorMessage } from '../../../types/error-message';
import {
  isEventOfType, constructEvent, DomainEvent, EventOfType,
} from '../../../domain-events';
import { UpdateGroupDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';
import { GroupId } from '../../../types/group-id';

type WriteModel = {
  disallowedNames: ReadonlyArray<string>,
  groupToUpdate: O.Option<{
    name: string,
    slug: string,
  }>,
};

const initialState: WriteModel = {
  disallowedNames: [],
  groupToUpdate: O.none,
};

const handleEvent = (idOfGroupToUpdate: GroupId) => (writeModel: WriteModel, event: DomainEvent): WriteModel => {
  if (isEventOfType('GroupJoined')(event)) {
    if (event.groupId === idOfGroupToUpdate) {
      return {
        ...writeModel,
        groupToUpdate: O.some({
          name: event.name,
          slug: event.slug,
        }),
      };
    }
    return {
      ...writeModel,
      disallowedNames: writeModel.disallowedNames.concat([event.name]),
    };
  }
  if (isEventOfType('GroupDetailsUpdated')(event)) {
    if (event.groupId === idOfGroupToUpdate) {
      return {
        ...writeModel,
        groupToUpdate: pipe(
          writeModel.groupToUpdate,
          O.match(
            () => { throw new Error('Database corruption'); },
            (groupToUpdate) => O.some({
              ...groupToUpdate,
              name: event.name ?? groupToUpdate.name,
            }),
          ),
        ),
      };
    }
  }
  return writeModel;
};

const isRelevantEvent = (event: DomainEvent): event is EventOfType<'GroupJoined'> | EventOfType<'GroupDetailsUpdated'> => isEventOfType('GroupJoined')(event) || isEventOfType('GroupDetailsUpdated')(event);

const getGroup = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isRelevantEvent),
  // RA.filter((event) => event.groupId === groupId),
  RA.reduce(initialState, handleEvent(groupId)),
);

const buildDisallowedNames = (disallowedNames: ReadonlyArray<string>, event: DomainEvent): ReadonlyArray<string> => {
  if (isEventOfType('GroupJoined')(event)) {
    return disallowedNames.concat([event.name]);
  }
  if (isEventOfType('GroupDetailsUpdated')(event)) {
    if (event.name !== undefined) {
      return disallowedNames.concat([event.name]);
    }
  }
  return disallowedNames;
};

const isUpdatePermitted = (command: UpdateGroupDetailsCommand, events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.groupId !== command.groupId),
  RA.reduce([], buildDisallowedNames),
  (disallowedNames) => (command.name === undefined || !disallowedNames.includes(command.name)),
);

export const update: ResourceAction<UpdateGroupDetailsCommand> = (command) => (events) => pipe(
  events,
  getGroup(command.groupId),
  E.right,
  E.filterOrElse(
    (writeModel) => O.isSome(writeModel.groupToUpdate),
    () => toErrorMessage('group not found'),
  ),
  E.filterOrElse(
    () => isUpdatePermitted(command, events),
    () => toErrorMessage('group name already in use'),
  ),
  E.chain((writeModel) => pipe(
    writeModel.groupToUpdate,
    E.fromOption(() => toErrorMessage('group not found')),
  )),
  E.map(
    (groupToUpdate) => ((command.name === groupToUpdate.name) ? [] : [constructEvent('GroupDetailsUpdated')({
      groupId: command.groupId,
      name: command.name,
      shortDescription: undefined,
      homepage: undefined,
      avatarPath: undefined,
      descriptionPath: undefined,
      slug: undefined,
    })]),
  ),
);
