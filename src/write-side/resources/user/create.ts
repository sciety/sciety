import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../../commands/create-user-account.js';
import { setUpUserIfNecessary } from './set-up-user-if-necessary.js';
import { checkCommand } from './check-command.js';
import { ResourceAction } from '../resource-action.js';

export const create: ResourceAction<CreateUserAccountCommand> = (command) => (events) => pipe(
  events,
  checkCommand(command),
  E.map(() => pipe(
    events,
    setUpUserIfNecessary(command),
  )),
);
