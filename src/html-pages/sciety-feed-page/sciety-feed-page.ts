import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { eventCard, Ports as EventCardPorts } from './event-card';
import { identifyFeedItems } from './identify-feed-items';
import { templateListItems } from '../../shared-components/list-items';
import { paginationControls } from '../../shared-components/pagination-controls';
import { supplementaryCard } from '../../shared-components/supplementary-card';
import { supplementaryInfo } from '../../shared-components/supplementary-info';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { GetAllEvents } from '../../shared-ports';
import { renderErrorPage } from './render-as-html/render-error-page';

type ViewModel = {
  cards: ReadonlyArray<HtmlFragment>,
  nextPage: O.Option<number>,
  numberOfPages: number,
  pageNumber: number,
};

const supplementaryItems = [
  supplementaryCard(
    'What is the Sciety feed?',
    toHtmlFragment(`
      <p>
        A feed of events that have happened across the Sciety network. Click on a card to find out more. You can build <a href="/my-feed">your own feed</a> of events relevant to you by following specific groups.
      </p>
    `),
  ),
];

const renderContent = (viewModel: ViewModel) => toHtmlFragment(`
  <header class="page-header">
    <h1>Sciety Feed</h1>
  </header>
  <section>
    <p class="sciety-feed-page-numbers">
      Showing page <b>${viewModel.pageNumber}</b> of <b>${viewModel.numberOfPages}</b><span class="visually-hidden"> pages of activity</span>
    </p>
    <ol class="sciety-feed-list">
      ${templateListItems(viewModel.cards, 'sciety-feed-list__item')}
    </ol>
    ${paginationControls('/sciety-feed?', viewModel.nextPage)}
  </section>
  ${supplementaryInfo(supplementaryItems, 'supplementary-info--sciety-feed')}
`);

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
  TE.bimap(
    renderErrorPage,
    (viewModel) => ({
      title: 'Sciety Feed',
      content: renderContent(viewModel),
    }),
  ),
);
