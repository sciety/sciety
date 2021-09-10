import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export const allEventsPage = (): TE.TaskEither<RenderPageError, Page> => TE.right({
  title: 'All events',
  content: toHtmlFragment('<h1>All events</h1>'),
});
