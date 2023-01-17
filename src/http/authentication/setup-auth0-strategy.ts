import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import Auth0Strategy from 'passport-auth0';
import { Logger } from '../../shared-ports';
import { toUserId } from '../../types/user-id';
import { UserAccount } from '../../user-account/set-up-user-if-necessary';

type Ports = {
  logger: Logger,
};

const auth0Config = {
  domain: process.env.AUTH0_DOMAIN ?? '',
  clientID: process.env.AUTH0_CLIENT_ID ?? '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
  callbackURL: process.env.AUTH0_CALLBACK_URL ?? '',
};

const profileCodec = t.type({
  id: t.string,
  displayName: t.string,
  nickname: t.string,
  picture: t.string,
});

type Profile = t.TypeOf<typeof profileCodec>;

const toUserAccount = (profile: Profile) => ({
  id: toUserId(profile.id),
  handle: profile.nickname,
  avatarUrl: profile.picture,
  displayName: profile.displayName,
});

const writeUserToState = (
  logger: Logger,
  done: (error: unknown, user?: unknown, info?: unknown) => void,
) => (userAccount: UserAccount) => {
  const passportUserState = {
    id: userAccount.id,
  };
  logger('debug', 'User details added to the Passport user state', passportUserState);
  done(
    undefined,
    passportUserState,
  );
};

export const setupAuth0Strategy = (ports: Ports) => new Auth0Strategy(
  auth0Config,
  (async (accessToken, refreshToken, extraParams, profile, done) => pipe(
    profile,
    profileCodec.decode,
    E.map(toUserAccount),
    TE.fromEither,
    TE.match(
      () => done('could-not-derive-user-account-from-profile'),
      writeUserToState(ports.logger, done),
    ),
  )()
  ),
);
