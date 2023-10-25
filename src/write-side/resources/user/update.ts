import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { UpdateUserDetailsCommand } from '../../commands';
import { replayUserResource } from './replay-user-resource';
import { constructEvent } from '../../../domain-events';
import { ResourceAction } from '../resource-action';
import * as UI from '../update-idempotency';

export const update: ResourceAction<UpdateUserDetailsCommand> = (command) => (events) => pipe(
  events,
  replayUserResource(command.userId),
  E.map(UI.changedFields(command)),
  E.map((changed) => (
    UI.isEmpty(changed)
      ? []
      : [constructEvent('UserDetailsUpdated')({
        userId: command.userId,
        avatarUrl: undefined,
        displayName: undefined,
        ...changed,
      })]
  )),
);
