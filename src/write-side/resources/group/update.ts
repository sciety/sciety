import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message.js';
import {
  isEventOfType, constructEvent, DomainEvent, EventOfType,
} from '../../../domain-events/index.js';
import { UpdateGroupDetailsCommand } from '../../commands/index.js';
import { ResourceAction } from '../resource-action.js';
import { GroupId } from '../../../types/group-id.js';

type GroupState = {
  name: string,
  shortDescription: string,
  largeLogoPath: string | undefined,
};

type ReplayedGroupState = E.Either<'no-such-group' | 'bad-data', GroupState>;

const buildGroup = (state: ReplayedGroupState, event: DomainEvent): ReplayedGroupState => {
  if (E.isLeft(state) && state.left === 'bad-data') {
    return state;
  }
  if (isEventOfType('GroupJoined')(event)) {
    return E.right({
      name: event.name,
      shortDescription: event.shortDescription,
      largeLogoPath: undefined,
    });
  }
  if (isEventOfType('GroupDetailsUpdated')(event)) {
    return pipe(
      state,
      E.match(
        () => E.left('bad-data'),
        (groupState) => E.right({
          name: event.name ?? groupState.name,
          shortDescription: event.shortDescription ?? groupState.shortDescription,
          largeLogoPath: event.largeLogoPath ?? groupState.largeLogoPath,
        }),
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

const calculateAttributesToUpdate = (
  command: UpdateGroupDetailsCommand,
  groupState: GroupState,
) => ({
  name: (command.name !== undefined && command.name !== groupState.name) ? command.name : undefined,
  largeLogoPath: (command.largeLogoPath !== undefined
    && command.largeLogoPath !== groupState.largeLogoPath)
    ? command.largeLogoPath
    : undefined,
  shortDescription: (command.shortDescription !== undefined
    && command.shortDescription !== groupState.shortDescription)
    ? command.shortDescription
    : undefined,
});

const hasAnyValues = (attributes: Record<string, string | undefined>): boolean => (
  (attributes.name !== undefined)
  || (attributes.shortDescription !== undefined)
  || (attributes.largeLogoPath !== undefined)
);

export const update: ResourceAction<UpdateGroupDetailsCommand> = (command) => (events) => pipe(
  events,
  getGroupState(command.groupId),
  E.filterOrElse(
    () => isUpdatePermitted(command, events),
    () => toErrorMessage('group name already in use'),
  ),
  E.map((groupState) => calculateAttributesToUpdate(command, groupState)),
  E.map((attributesToUpdate) => (hasAnyValues(attributesToUpdate) ? [constructEvent('GroupDetailsUpdated')({
    groupId: command.groupId,
    homepage: undefined,
    avatarPath: undefined,
    descriptionPath: undefined,
    slug: undefined,
    ...attributesToUpdate,
  })] : [])),
);
