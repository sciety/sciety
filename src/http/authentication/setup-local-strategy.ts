/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy as LocalStrategy } from 'passport-local';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { setUpUserIfNecessary } from '../../write-side/create-user-account/set-up-user-if-necessary';
import { UserHandle } from '../../types/user-handle';
import { toUserId } from '../../types/user-id';
import { Ports as CreateUserAccountCommandHandlerPorts } from '../../write-side/create-user-account';
import { CreateUserAccountCommand } from '../../write-side/commands';
import { writeUserIdToState } from '../authentication-and-logging-in-of-sciety-users';
import { Logger } from '../../shared-ports';

type Ports = CreateUserAccountCommandHandlerPorts & {
  logger: Logger,
};

const createUserAccountForLocalStrategy = (
  ports: Ports,
) => async (username: string): Promise<string> => {
  const command: CreateUserAccountCommand = {
    userId: toUserId(username),
    handle: `H${username}` as UserHandle,
    avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
    displayName: '',
  };
  return pipe(
    ports.getAllEvents,
    T.map(setUpUserIfNecessary(command)),
    T.chain(ports.commitEvents),
  )();
};

const noop = (
  ports: Ports,
) => async (username: string): Promise<string> => T.of('')();

export const setupLocalStrategy = (ports: Ports) => new LocalStrategy(
  (username, _password, cb) => {
    // void createUserAccountForLocalStrategy(ports)(username)
    void noop(ports)(username)
      .then(() => pipe(
        username,
        toUserId,
        E.right,
        writeUserIdToState(cb),
      ));
  },
);
