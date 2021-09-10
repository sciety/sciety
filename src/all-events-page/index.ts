import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

const renderContent = (item: string) => toHtmlFragment(`
  <h1>All events</h1>
  <ol>
    <li>${item}</li>
  </ol>
`);

export const allEventsPage = (): TE.TaskEither<RenderPageError, Page> => TE.right({
  title: 'All events',
  content: renderContent('The item'),
});
