import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { SelectAllListsOwnedBy } from '../shared-ports';
import { OwnedByQuery } from '../types/codecs/OwnedByQuery';
import * as LOID from '../types/list-owner-id';

type Ports = {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const ownedBy = (adapters: Ports): Middleware => async ({ params, response }, next) => {
  pipe(
    params.ownerId,
    LOID.fromStringCodec.decode,
    E.map(
      adapters.selectAllListsOwnedBy,
    ),
    E.match(
      () => {
        response.status = StatusCodes.SERVICE_UNAVAILABLE;
      },
      (items) => {
        response.status = StatusCodes.OK;
        response.set({ 'Content-Type': 'application/json' });
        response.body = OwnedByQuery.encode({ items });
      },
    ),
  );

  await next();
};
