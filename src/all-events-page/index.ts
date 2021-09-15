import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { collapseCloseEvents, CollapsedEvent, isCollapsedGroupEvaluatedMultipleArticles } from './collapse-close-events';
import { DomainEvent } from '../domain-events';
import { templateDate } from '../shared-components/date';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

const renderContent = (items: ReadonlyArray<HtmlFragment>) => toHtmlFragment(`
  <h1>All events</h1>
  <ol class="all-events-list">
    ${templateListItems(items, 'all-events-list__item')}
  </ol>
`);

export const allEventsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
});

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

type Params = t.TypeOf<typeof allEventsCodec>;

const pageSize = 20;

const renderEvent = (event: DomainEvent | CollapsedEvent) => {
  if (isCollapsedGroupEvaluatedMultipleArticles(event)) {
    return toHtmlFragment(`
      <article class="all-events-card">
        <span>${event.groupId} evaluated ${event.articleCount} articles. ${templateDate(event.date)}</span>
      </article>
    `);
  }

  return toHtmlFragment(`
    <article class="all-events-card">
      ${JSON.stringify(event, null, 2)}
    </article>
  `);
};

export const allEventsPage = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  ports.getAllEvents,
  T.map(RA.reverse),
  T.map(collapseCloseEvents),
  T.map((events) => events.slice(
    (params.page - 1) * pageSize,
    params.page * pageSize,
  )),
  T.map(RA.map(renderEvent)),
  T.map((items) => E.right({
    title: 'All events',
    content: renderContent(items),
  })),
);
