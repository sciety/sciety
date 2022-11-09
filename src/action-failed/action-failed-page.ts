import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type ActionFailedPage = TE.TaskEither<RenderPageError, Page>;

export const actionFailedPage: ActionFailedPage = TE.left(
  {
    type: DE.unavailable,
    message: toHtmlFragment('Something unexpected happened; the action may have not completed. Please go back and try again.'),
  },
);
