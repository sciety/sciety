import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local';
import { pipe } from 'fp-ts/function';
import { userIdCodec } from '../../types/user-id.js';
import { authenticateWithUserId } from '../authentication-and-logging-in-of-sciety-users.js';

const callback: VerifyFunction = (candidateUserId, _password, cb) => {
  pipe(
    candidateUserId,
    userIdCodec.decode,
    authenticateWithUserId(cb),
  );
};

export const testingPassportStrategy = new LocalStrategy(callback);
