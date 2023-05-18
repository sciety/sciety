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
  groupToUpdate: O.Option<{
    name: string,
    slug: string,
  }>,
};

const initialState: ReadModel = {
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
  }
  return readmodel;
};

export const update: ResourceAction<UpdateGroupDetailsCommand> = (command) => (events) => pipe(
  events,
  RA.reduce(initialState, handleEvent(command.groupId)),
  (readModel) => readModel.groupToUpdate,
  E.fromOption(() => toErrorMessage('not implemented')),
  E.map(
    (group) => ((group.name === command.name) ? [] : [constructEvent('GroupDetailsUpdated')({
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
