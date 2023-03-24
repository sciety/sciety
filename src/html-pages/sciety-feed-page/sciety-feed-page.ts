import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { eventCard, Ports as EventCardPorts } from './event-card';
import { identifyFeedItems } from './identify-feed-items';
import * as DE from '../../types/data-error';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { GetAllEvents } from '../../shared-ports';
import { renderErrorPage } from './render-as-html/render-error-page';
import { renderAsHtml } from './render-as-html/render-as-html';

export const scietyFeedCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
});

// ts-unused-exports:disable-next-line
export type Ports = EventCardPorts & {
  getAllEvents: GetAllEvents,
};

type Params = t.TypeOf<typeof scietyFeedCodec>;

export const scietyFeedPage = (
  ports: Ports,
) => (pageSize: number) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  ports.getAllEvents,
  T.map(identifyFeedItems(pageSize, params.page)),
  TE.chainW(({ items, ...rest }) => pipe(
    items,
    O.traverseArray(eventCard(ports)),
    O.map((cards) => ({ cards, ...rest })),
    TE.fromOption(() => DE.notFound),
  )),
  TE.bimap(renderErrorPage, renderAsHtml),
);
