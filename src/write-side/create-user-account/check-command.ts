import * as B from 'fp-ts/boolean';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../commands';
import { DomainEvent } from '../../domain-events';
import { toErrorMessage } from '../../types/error-message';
import * as User from '../resources/user/handle-exists';

export const checkCommand = (command: CreateUserAccountCommand) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  User.handleExists(command.handle),
  B.match(
    () => E.right(command),
    () => E.left(toErrorMessage('user-handle-already-exists')),
  ),
);
