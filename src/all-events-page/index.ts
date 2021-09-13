import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DomainEvent } from '../domain-events';
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

export const allEventsPage = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  ports.getAllEvents,
  T.map(RA.reverse),
  T.map((events) => events.slice(
    (params.page - 1) * pageSize,
    params.page * pageSize,
  )),
  T.map(RA.map((event) => JSON.stringify(event, null, 2))),
  T.map(RA.map((event) => `
    <article class="all-events-card">
      ${event}
    </article>
  `)),
  T.map(RA.map(toHtmlFragment)),
  T.map((items) => E.right({
    title: 'All events',
    content: renderContent(items),
  })),
);
