import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import {
  isEventOfType, constructEvent, DomainEvent, EventOfType,
} from '../../../domain-events';
import { UpdateGroupDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';
import { GroupId } from '../../../types/group-id';

type GroupState = {
  name: string,
};

type ReplayedGroupState = E.Either<'no-such-group' | 'bad-data', GroupState>;

const buildGroup = (state: ReplayedGroupState, event: DomainEvent): ReplayedGroupState => {
  if (E.isLeft(state) && state.left === 'bad-data') {
    return state;
  }
  if (isEventOfType('GroupJoined')(event)) {
    return E.right({ name: event.name });
  }
  if (isEventOfType('GroupDetailsUpdated')(event)) {
    return pipe(
      state,
      E.match(
        () => E.left('bad-data'),
        (groupState) => E.right({ name: event.name ?? groupState.name }),
      ),
    );
  }
  return state;
};

const isRelevantEvent = (event: DomainEvent): event is EventOfType<'GroupJoined'> | EventOfType<'GroupDetailsUpdated'> => isEventOfType('GroupJoined')(event) || isEventOfType('GroupDetailsUpdated')(event);

const getGroupState = (
  groupId: GroupId,
) => (
  events: ReadonlyArray<DomainEvent>,
): E.Either<ErrorMessage, GroupState> => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.groupId === groupId),
  RA.reduce(E.left('no-such-group' as const), buildGroup),
  E.mapLeft(toErrorMessage),
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
  getGroupState(command.groupId),
  E.filterOrElse(
    () => isUpdatePermitted(command, events),
    () => toErrorMessage('group name already in use'),
  ),
  E.map(
    (groupState) => ((command.name === groupState.name) ? [] : [constructEvent('GroupDetailsUpdated')({
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
