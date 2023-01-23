import { Strategy as LocalStrategy } from 'passport-local';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { UserHandle } from '../../types/user-handle';
import { toUserId } from '../../types/user-id';
import { createUserAccountCommandHandler, Ports as CreateUserAccountCommandHandlerPorts } from '../../write-side/create-user-account';
import { CreateUserAccountCommand } from '../../write-side/commands';
import { writeUserIdToState } from '../authentication-and-logging-in-of-sciety-users';
import { Logger } from '../../shared-ports';

type Ports = CreateUserAccountCommandHandlerPorts & {
  logger: Logger,
};

export const setupLocalStrategy = (ports: Ports) => new LocalStrategy(
  (username, _password, cb) => {
    ports.logger('debug', '>>>>>>> inside setupLocalStrategy', { username });
    const command: CreateUserAccountCommand = {
      userId: toUserId(username),
      handle: `H${username}` as UserHandle,
      avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
      displayName: '',
    };
    void createUserAccountCommandHandler(ports)(command)()
      .then((commandResult) => pipe(
        commandResult,
        E.map(() => command.userId),
        writeUserIdToState(cb),
      ));
  },
);
