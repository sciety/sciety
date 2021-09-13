import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
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

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const allEventsPage = (ports: Ports) => (): TE.TaskEither<RenderPageError, Page> => pipe(
  ports.getAllEvents,
  T.map(RA.reverse),
  T.map(RA.takeLeft(1000)),
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
