import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { toErrorMessage } from '../../../types/error-message';
import { isEventOfType, constructEvent, DomainEvent } from '../../../domain-events';
import { UpdateGroupDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';
import { GroupId } from '../../../types/group-id';

type ReadModel = {
  disallowedNames: ReadonlyArray<string>,
  groupToUpdate: O.Option<{
    name: string,
    slug: string,
  }>,
};

const initialState: ReadModel = {
  disallowedNames: [],
  groupToUpdate: O.none,
};

const handleEvent = (idOfGroupToUpdate: GroupId) => (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('GroupJoined')(event)) {
    if (event.groupId === idOfGroupToUpdate) {
      return {
        ...readmodel,
        groupToUpdate: O.some({
          name: event.name,
          slug: event.slug,
        }),
      };
    }
    return {
      ...readmodel,
      disallowedNames: readmodel.disallowedNames.concat([event.name]),
    };
  }
  return readmodel;
};

const nameNotInUse = (readmodel: ReadModel, name: string) => (
  !readmodel.disallowedNames.includes(name)
);

export const update: ResourceAction<UpdateGroupDetailsCommand> = (command) => (events) => pipe(
  events,
  RA.reduce(initialState, handleEvent(command.groupId)),
  E.right,
  E.filterOrElse(
    (readmodel) => O.isSome(readmodel.groupToUpdate),
    () => toErrorMessage('group not found'),
  ),
  E.filterOrElse(
    (readmodel) => (command.name === undefined || nameNotInUse(readmodel, command.name)),
    () => toErrorMessage('group name already in use'),
  ),
  E.chain((readModel) => pipe(
    readModel.groupToUpdate,
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
