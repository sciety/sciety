import { Strategy as LocalStrategy } from 'passport-local';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { toUserId } from '../../types/user-id';
import { writeUserIdToState } from '../authentication-and-logging-in-of-sciety-users';

export const testingPassportStrategy = new LocalStrategy(
  (username, _password, cb) => {
    pipe(
      username,
      toUserId,
      E.right,
      writeUserIdToState(cb),
    );
  },
);
