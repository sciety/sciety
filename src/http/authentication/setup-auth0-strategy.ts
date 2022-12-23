import Auth0Strategy from 'passport-auth0';
import { fetchData } from '../../infrastructure/fetchers';
import { CommitEvents, GetAllEvents, Logger } from '../../shared-ports';
import { toUserId } from '../../types/user-id';
import { createAccountIfNecessary } from '../../user-account/create-account-if-necessary';

const callAuth0ManagementApi = (logger: Logger) => async (id: string) => {
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

const createUserAccountData = async (profile: Auth0Strategy.Profile, logger: Logger) => {
  const isAuthdViaTwitter = (id: string) => id.includes('twitter');
  const screenName = await callAuth0ManagementApi(logger)(profile.id);
  return {
    id: toUserId(profile.id.substring(profile.id.indexOf('|') + 1)),
    handle: isAuthdViaTwitter(profile.id) ? screenName : profile.nickname,
    avatarUrl: profile.picture,
    displayName: profile.displayName,
  };
};

export const setupAuth0Strategy = (ports: Ports) => new Auth0Strategy(
  auth0Config,
  (async (accessToken, refreshToken, extraParams, profile, done) => {
    const userAccount = await createUserAccountData(profile, ports.logger);
    void createAccountIfNecessary(ports)(userAccount)()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .then(() => done(
        undefined,
        {
          id: userAccount.id,
          handle: userAccount.handle,
          avatarUrl: userAccount.avatarUrl,
        },
      ));
  }
  ),
);
