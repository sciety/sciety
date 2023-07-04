import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../../commands/create-user-account';
import { setUpUserIfNecessary } from './set-up-user-if-necessary';
import { checkCommand } from './check-command';
import { ResourceAction } from '../resource-action';

export const create: ResourceAction<CreateUserAccountCommand> = (command) => (events) => pipe(
  events,
  checkCommand(command),
  E.map(() => pipe(
    events,
    setUpUserIfNecessary(command),
  )),
);
