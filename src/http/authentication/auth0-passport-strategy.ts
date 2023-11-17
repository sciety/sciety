import { pipe } from 'fp-ts/function';
import Auth0Strategy from 'passport-auth0';
import { userIdCodec } from '../../types/user-id.js';
import { authenticateWithUserId } from '../authentication-and-logging-in-of-sciety-users.js';

const auth0Config = {
  domain: process.env.AUTH0_DOMAIN ?? '',
  clientID: process.env.AUTH0_CLIENT_ID ?? '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
  callbackURL: process.env.AUTH0_CALLBACK_URL ?? '',
};

const callback: Auth0Strategy.VerifyFunction = async (accessToken, refreshToken, extraParams, profile, done) => pipe(
  profile.id,
  userIdCodec.decode,
  authenticateWithUserId(done),
);

export const auth0PassportStrategy = (): Auth0Strategy => new Auth0Strategy(auth0Config, callback);
