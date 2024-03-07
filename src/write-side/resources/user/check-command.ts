import * as B from 'fp-ts/boolean';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../../commands';
import { DomainEvent } from '../../../domain-events';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import * as User from './handle-exists';

export const userHandleAlreadyExistsError = toErrorMessage('user-handle-already-exists');

export const checkCommand = (
  command: CreateUserAccountCommand,
) => (events: ReadonlyArray<DomainEvent>): E.Either<ErrorMessage, CreateUserAccountCommand> => pipe(
  events,
  User.handleExists(command.handle),
  B.match(
    () => E.right(command),
    () => E.left(userHandleAlreadyExistsError),
  ),
);
