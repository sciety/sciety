import { Buffer } from 'buffer';
import { createPublicKey } from 'crypto';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';

const appOrigin = process.env.APP_ORIGIN ?? 'https://sciety.org';

type PublicKey = {
  id: string,
  owner: string,
  publicKeyPem: string,
};

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
  publicKey?: PublicKey,
};

export const derivePublicKeyPem = (privateKeyPem: string): O.Option<string> => pipe(
  E.tryCatch(
    () => createPublicKey(privateKeyPem).export({ type: 'spki', format: 'pem' }).toString(),
    () => 'invalid private key',
  ),
  O.fromEither,
);

const decodeBase64 = (value: string) => Buffer.from(value, 'base64').toString('utf8');

export const derivePublicKeyPemFromBase64EncodedPrivateKey = (value: string): O.Option<string> => pipe(
  value,
  decodeBase64,
  derivePublicKeyPem,
);

export const publicKeyPem = pipe(
  process.env.ACTIVITYPUB_PRIVATE_KEY,
  O.fromNullable,
  O.chain(derivePublicKeyPemFromBase64EncodedPrivateKey),
);

export const constructActorDocument = (origin: string, actorPublicKeyPem: O.Option<string>): ActorDocument => {
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
    ...pipe(
      actorPublicKeyPem,
      O.match(
        () => ({}),
        (pem) => ({
          publicKey: {
            id: `${actorId}#main-key`,
            owner: actorId,
            publicKeyPem: pem,
          },
        }),
      ),
    ),
  };
};

export const activitypubActor = (): Middleware => (
  async ({ response }, next) => {
    response.status = StatusCodes.OK;
    response.body = constructActorDocument(appOrigin, publicKeyPem);
    response.type = 'application/activity+json';

    await next();
  }
);
