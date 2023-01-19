import { Strategy as LocalStrategy } from 'passport-local';
import * as E from 'fp-ts/Either';
import { UserHandle } from '../../types/user-handle';
import { toUserId } from '../../types/user-id';
import { createAccountIfNecessary, Ports } from '../../user-account/create-account-if-necessary';
import { CreateUserAccountCommand } from '../../write-side/commands';
import { writeUserIdToState } from '../authentication-and-logging-in-of-sciety-users';

export const setupLocalStrategy = (ports: Ports) => new LocalStrategy(
  (username, _password, cb) => {
    const command: CreateUserAccountCommand = {
      userId: toUserId(username),
      handle: 'account27775998' as UserHandle,
      avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
      displayName: '',
    };
    void createAccountIfNecessary(ports)(command)()
      .then(() => writeUserIdToState(cb)(E.right(command.userId)));
  },
);
