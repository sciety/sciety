import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

const renderContent = (item: string) => toHtmlFragment(`
  <h1>All events</h1>
  <ol>
    <li>${item}</li>
  </ol>
`);

export const allEventsPage = (): TE.TaskEither<RenderPageError, Page> => pipe(
  T.of('the_event_id'),
  T.map((eventId: string) => E.right({
    title: 'All events',
    content: renderContent(eventId),
  })),
);
