import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { toErrorMessage } from '../../../types/error-message';
import { isEventOfType } from '../../../domain-events/domain-event';
import { UpdateGroupDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';
import { constructEvent } from '../../../domain-events';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const update: ResourceAction<UpdateGroupDetailsCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('GroupJoined')),
  RA.filter((event) => event.groupId === command.groupId),
  RA.head,
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
