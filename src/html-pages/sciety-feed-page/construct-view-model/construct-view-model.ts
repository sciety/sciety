import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { constructEventCard } from './construct-event-card';
import { Dependencies } from './dependencies';
import { identifyFeedItems } from './identify-feed-items';
import { queryStringParameters } from '../../../standards';
import * as DE from '../../../types/data-error';
import { ViewModel } from '../view-model';

export const scietyFeedCodec = t.type({
  [queryStringParameters.page]: queryStringParameters.pageCodec,
});

export type Params = t.TypeOf<typeof scietyFeedCodec>;

type ConstructViewModel = (
  dependencies: Dependencies,
  pageSize: number,
) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies, pageSize) => (params) => pipe(
  dependencies.getAllEvents,
  T.map(identifyFeedItems(pageSize, params.page)),
  TE.chainW(({ items, ...rest }) => pipe(
    items,
    O.traverseArray(constructEventCard(dependencies)),
    O.map((cards) => ({
      cards,
      ...rest,
      pageHeading: 'Sciety Feed',
    })),
    TE.fromOption(() => DE.notFound),
  )),
);
