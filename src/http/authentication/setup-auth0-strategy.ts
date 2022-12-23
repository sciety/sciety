import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import Auth0Strategy from 'passport-auth0';
import { fetchData } from '../../infrastructure/fetchers';
import { CommitEvents, GetAllEvents, Logger } from '../../shared-ports';
import { toUserId } from '../../types/user-id';
import { createAccountIfNecessary } from '../../user-account/create-account-if-necessary';

const getTwitterScreenNameViaAuth0 = (logger: Logger) => (id: string) => async () => {
  const token = process.env.AUTH0_MANAGEMENT_API_SECRET;
  const response: { data: { screen_name: string } } = await fetchData(logger)(
    `https://dev-sqa2k3wwnhpxk36d.eu.auth0.com/api/v2/users/${id}`,
    {
      Authorization: `Bearer ${token ?? ''}`,
    },
  );

  return response.data.screen_name;
};

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

const deriveHandle = (profile: Profile, logger: Logger): T.Task<string> => {
  const isAuthdViaTwitter = (id: string) => id.includes('twitter');
  const screenName = getTwitterScreenNameViaAuth0(logger)(profile.id);
  const handle = isAuthdViaTwitter(profile.id) ? screenName : T.of(profile.nickname);
  return handle;
};

const createUserAccountData = (profile: Profile, logger: Logger) => pipe(
  {
    id: T.of(toUserId(profile.id.substring(profile.id.indexOf('|') + 1))),
    handle: deriveHandle(profile, logger),
    avatarUrl: T.of(profile.picture),
    displayName: T.of(profile.displayName),
  },
  sequenceS(T.ApplicativePar),
);

export const setupAuth0Strategy = (ports: Ports) => new Auth0Strategy(
  auth0Config,
  (async (accessToken, refreshToken, extraParams, profile, done) => pipe(
    profile,
    profileCodec.decode,
    TE.fromEither,
    TE.chainTaskK((validatedProfile) => createUserAccountData(validatedProfile, ports.logger)),
    TE.chainFirstTaskK(createAccountIfNecessary(ports)),
    TE.match(
      () => done('could-not-derive-user-account-from-profile'),
      (userAccount) => done(
        undefined,
        {
          id: userAccount.id,
          handle: userAccount.handle,
          avatarUrl: userAccount.avatarUrl,
        },
      ),
    ),
  )
  ),
);
