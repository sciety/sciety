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
  T.of(new Date('2021-09-10')),
  T.map((eventDate: Date) => E.right({
    title: 'All events',
    content: renderContent(eventDate.toISOString()),
  })),
);
