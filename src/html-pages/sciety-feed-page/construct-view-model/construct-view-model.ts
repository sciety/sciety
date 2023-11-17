import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { constructEventCard } from './construct-event-card.js';
import { identifyFeedItems } from './identify-feed-items.js';
import * as DE from '../../../types/data-error.js';
import { ViewModel } from '../view-model.js';
import { Dependencies } from './dependencies.js';

export const scietyFeedCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
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
