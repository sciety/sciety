import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { toErrorMessage } from '../../../types/error-message';
import { isEventOfType, constructEvent, DomainEvent } from '../../../domain-events';
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
  return writeModel;
};

const nameNotInUse = (writeModel: WriteModel, name: string) => (
  !writeModel.disallowedNames.includes(name)
);

export const update: ResourceAction<UpdateGroupDetailsCommand> = (command) => (events) => pipe(
  events,
  RA.reduce(initialState, handleEvent(command.groupId)),
  E.right,
  E.filterOrElse(
    (writeModel) => O.isSome(writeModel.groupToUpdate),
    () => toErrorMessage('group not found'),
  ),
  E.filterOrElse(
    (writeModel) => (command.name === undefined || nameNotInUse(writeModel, command.name)),
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
