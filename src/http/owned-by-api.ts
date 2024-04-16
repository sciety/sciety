import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { Queries } from '../read-models';
import { toExpressionDoisByMostRecentlyAdded, List } from '../read-models/lists';
import { renderRawUserInputForJsonApi } from '../shared-components/raw-user-input-renderers';
import { ownedByQueryCodec } from '../types/codecs/owned-by-query-codec';
import * as LOID from '../types/list-owner-id';

const constructViewModel = (lists: ReadonlyArray<List>) => pipe(
  lists,
  RA.map((list) => ({
    ...list,
    description: pipe(
      list.description,
      renderRawUserInputForJsonApi,
    ),
    articleIds: [...toExpressionDoisByMostRecentlyAdded(list.entries)],
  })),
);

export const ownedBy = (queries: Queries): Middleware => async ({ params, response }, next) => {
  pipe(
    params.ownerId,
    LOID.fromStringCodec.decode,
    E.map(queries.selectAllListsOwnedBy),
    E.map(constructViewModel),
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
