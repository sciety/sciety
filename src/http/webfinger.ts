import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { actorIdFor, actorPreferredUsername, appOrigin } from './activitypub-actor';

type JsonResourceDescriptor = {
  subject: string,
  links: ReadonlyArray<{
    rel: string,
    type: string,
    href: string,
  }>,
};

type WebfingerError = 'missing-resource' | 'unknown-resource';

const accountFor = (origin: string) => `acct:${actorPreferredUsername}@${new URL(origin).host}`;

const isOurAccount = (origin: string, resource: string) => (
  resource.toLowerCase() === accountFor(origin).toLowerCase()
);

export const constructWebfingerResponse = (
  origin: string,
  resource: unknown,
): E.Either<WebfingerError, JsonResourceDescriptor> => {
  if (typeof resource !== 'string' || resource === '') {
    return E.left('missing-resource');
  }
  if (!isOurAccount(origin, resource)) {
    return E.left('unknown-resource');
  }
  return E.right({
    subject: accountFor(origin),
    links: [
      {
        rel: 'self',
        type: 'application/activity+json',
        href: actorIdFor(origin),
      },
    ],
  });
};

const statusFor = (error: WebfingerError) => (
  error === 'missing-resource' ? StatusCodes.BAD_REQUEST : StatusCodes.NOT_FOUND
);

export const webfinger = (): Middleware => (
  async (context, next) => {
    context.set('Access-Control-Allow-Origin', '*');
    pipe(
      constructWebfingerResponse(appOrigin, context.query.resource),
      E.match(
        (error) => {
          context.response.status = statusFor(error);
        },
        (jrd) => {
          context.response.status = StatusCodes.OK;
          context.response.body = jrd;
          context.response.type = 'application/jrd+json';
        },
      ),
    );

    await next();
  }
);
