import { pipe } from 'fp-ts/function';
import Auth0Strategy from 'passport-auth0';
import { toUserId } from '../../types/user-id';
import { writeUserIdToState } from '../authentication-and-logging-in-of-sciety-users';

const auth0Config = {
  domain: process.env.AUTH0_DOMAIN ?? '',
  clientID: process.env.AUTH0_CLIENT_ID ?? '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
  callbackURL: process.env.AUTH0_CALLBACK_URL ?? '',
};

export const setupAuth0Strategy = () => new Auth0Strategy(
  auth0Config,
  async (accessToken, refreshToken, extraParams, profile, done) => pipe(
    profile.id,
    toUserId,
    writeUserIdToState(done),
  ),
);
