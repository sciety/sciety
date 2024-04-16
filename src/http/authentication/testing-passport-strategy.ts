import { pipe } from 'fp-ts/function';
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local';
import { userIdCodec } from '../../types/user-id';
import { authenticateWithUserId } from '../authentication-and-logging-in-of-sciety-users';

const callback: VerifyFunction = (candidateUserId, _password, cb) => {
  pipe(
    candidateUserId,
    userIdCodec.decode,
    authenticateWithUserId(cb),
  );
};

export const testingPassportStrategy = new LocalStrategy(callback);
