import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

const appOrigin = process.env.APP_ORIGIN ?? 'https://sciety.org';

type ActorDocument = {
  '@context': ReadonlyArray<string>,
  id: string,
  type: 'Application',
  preferredUsername: string,
  name: string,
  summary: string,
  url: string,
  inbox: string,
  outbox: string,
};

export const constructActorDocument = (origin: string): ActorDocument => {
  const actorId = `${origin}/activitypub/actor`;
  return {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      'https://w3id.org/security/v1',
    ],
    id: actorId,
    type: 'Application',
    preferredUsername: 'sciety',
    name: 'Sciety',
    summary: 'Sciety (https://sciety.org) brings together evaluations and discussions of preprints. This account fetches public posts that mention preprints. Contact: team@sciety.org',
    url: `${origin}/about`,
    inbox: `${actorId}/inbox`,
    outbox: `${actorId}/outbox`,
  };
};

export const activitypubActor = (): Middleware => (
  async ({ response }, next) => {
    response.status = StatusCodes.OK;
    response.body = constructActorDocument(appOrigin);
    response.type = 'application/activity+json';

    await next();
  }
);
