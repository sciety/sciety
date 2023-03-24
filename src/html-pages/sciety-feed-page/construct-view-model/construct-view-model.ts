import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { eventCard, Ports as EventCardPorts } from './event-card';
import { identifyFeedItems } from './identify-feed-items';
import * as DE from '../../../types/data-error';
import { GetAllEvents } from '../../../shared-ports';
import { ViewModel } from '../view-model';

export const scietyFeedCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
});

// ts-unused-exports:disable-next-line
export type Ports = EventCardPorts & {
  getAllEvents: GetAllEvents,
};

export type Params = t.TypeOf<typeof scietyFeedCodec>;

type ConstructViewModel = (
  ports: Ports,
  pageSize: number,
) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports, pageSize) => (params) => pipe(
  ports.getAllEvents,
  T.map(identifyFeedItems(pageSize, params.page)),
  TE.chainW(({ items, ...rest }) => pipe(
    items,
    O.traverseArray(eventCard(ports)),
    O.map((cards) => ({ cards, ...rest })),
    TE.fromOption(() => DE.notFound),
  )),
);
