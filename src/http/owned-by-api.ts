import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { ownedByQueryCodec } from '../types/codecs/owned-by-query-codec';
import * as LOID from '../types/list-owner-id';
import { Queries } from '../read-models';

export const ownedBy = (queries: Queries): Middleware => async ({ params, response }, next) => {
  pipe(
    params.ownerId,
    LOID.fromStringCodec.decode,
    E.map(
      queries.selectAllListsOwnedBy,
    ),
    E.match(
      () => {
        response.status = StatusCodes.SERVICE_UNAVAILABLE;
      },
      (items) => {
        response.status = StatusCodes.OK;
        response.set({ 'Content-Type': 'application/json' });
        response.body = ownedByQueryCodec.encode({ items });
      },
    ),
  );

  await next();
};
