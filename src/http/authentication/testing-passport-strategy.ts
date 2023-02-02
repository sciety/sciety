import { Strategy as LocalStrategy } from 'passport-local';
import { pipe } from 'fp-ts/function';
import { userIdCodec } from '../../types/user-id';
import { writeUserIdToState } from '../authentication-and-logging-in-of-sciety-users';

export const testingPassportStrategy = new LocalStrategy(
  (candidateUserId, _password, cb) => {
    pipe(
      candidateUserId,
      userIdCodec.decode,
      writeUserIdToState(cb),
    );
  },
);
