/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy as LocalStrategy } from 'passport-local';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { UserHandle } from '../../types/user-handle';
import { toUserId } from '../../types/user-id';
import { createUserAccountCommandHandler, Ports as CreateUserAccountCommandHandlerPorts } from '../../write-side/create-user-account';
import { CreateUserAccountCommand } from '../../write-side/commands';
import { writeUserIdToState } from '../authentication-and-logging-in-of-sciety-users';
import { Logger } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';
import { ErrorMessage } from '../../types/error-message';

type Ports = CreateUserAccountCommandHandlerPorts & {
  logger: Logger,
};

const createUserAccountForLocalStrategy = (
  ports: Ports,
) => async (username: string): Promise<E.Either<ErrorMessage, CommandResult>> => {
  const command: CreateUserAccountCommand = {
    userId: toUserId(username),
    handle: `H${username}` as UserHandle,
    avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
    displayName: '',
  };
  return createUserAccountCommandHandler(ports)(command)();
};

const noop = (
  ports: Ports,
) => async (username: string): Promise<E.Either<ErrorMessage, CommandResult>> => T.of(E.right('no-events-created' as CommandResult))();

export const setupLocalStrategy = (ports: Ports) => new LocalStrategy(
  (username, _password, cb) => {
    void createUserAccountForLocalStrategy(ports)(username)
    // void noop(ports)(username)
      .then((commandResult) => pipe(
        commandResult,
        E.map(() => toUserId(username)),
        writeUserIdToState(cb),
      ));
  },
);
