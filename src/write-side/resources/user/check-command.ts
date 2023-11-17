import * as B from 'fp-ts/boolean';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../../commands/index.js';
import { DomainEvent } from '../../../domain-events/index.js';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message.js';
import * as User from './handle-exists.js';

export const checkCommand = (
  command: CreateUserAccountCommand,
) => (events: ReadonlyArray<DomainEvent>): E.Either<ErrorMessage, CreateUserAccountCommand> => pipe(
  events,
  User.handleExists(command.handle),
  B.match(
    () => E.right(command),
    () => E.left(toErrorMessage('user-handle-already-exists')),
  ),
);
