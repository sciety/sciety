import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import Auth0Strategy from 'passport-auth0';
import { CommitEvents, GetAllEvents, Logger } from '../../shared-ports';
import { toUserId } from '../../types/user-id';
import { createAccountIfNecessary } from '../../user-account/create-account-if-necessary';
import { UserAccount } from '../../user-account/set-up-user-if-necessary';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
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
  id: toUserId(profile.id.substring(profile.id.indexOf('|') + 1)),
  handle: profile.nickname,
  avatarUrl: profile.picture,
  displayName: profile.displayName,
});

const writeUserToState = (
  done: (error: unknown, user?: unknown, info?: unknown) => void,
) => (userAccount: UserAccount) => done(
  undefined,
  {
    id: userAccount.id,
    handle: userAccount.handle,
    avatarUrl: userAccount.avatarUrl,
  },
);

export const setupAuth0Strategy = (ports: Ports) => new Auth0Strategy(
  auth0Config,
  (async (accessToken, refreshToken, extraParams, profile, done) => pipe(
    profile,
    profileCodec.decode,
    E.map(toUserAccount),
    TE.fromEither,
    TE.chainFirstTaskK(createAccountIfNecessary(ports)),
    TE.match(
      () => done('could-not-derive-user-account-from-profile'),
      writeUserToState(done),
    ),
  )()
  ),
);
