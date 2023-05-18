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

const buildReadModel = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>): ReadModel => pipe(
  events,
  RA.filter(isEventOfType('GroupJoined')),
  RA.filter((event) => event.groupId === groupId),
  RA.head,
  O.match(
    () => ({
      groupToUpdate: O.none,
    }),
    (groupToUpdate) => ({
      groupToUpdate: O.some({
        name: groupToUpdate.name,
        slug: groupToUpdate.slug,
      }),
    }),
  ),
);

export const update: ResourceAction<UpdateGroupDetailsCommand> = (command) => (events) => pipe(
  events,
  buildReadModel(command.groupId),
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
