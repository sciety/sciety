import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Queries } from '../read-models';
import { toExpressionDoisByMostRecentlyAdded, List } from '../read-models/lists';
import { NonHtmlView } from '../read-side/non-html-views/non-html-view';
import { toNonHtmlViewRepresentation } from '../read-side/non-html-views/non-html-view-representation';
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

export const ownedBy = (queries: Queries): NonHtmlView => (params) => pipe(
  params.ownerId,
  LOID.fromStringCodec.decode,
  E.map(queries.selectAllListsOwnedBy),
  E.map(constructViewModel),
  E.bimap(
    () => ({
      status: StatusCodes.BAD_REQUEST,
      message: 'Cannot understand the ownerId',
    }),
    (items) => toNonHtmlViewRepresentation(
      ownedByQueryCodec.encode({ items }),
      'application/json',
    ),
  ),
  T.of,
);
