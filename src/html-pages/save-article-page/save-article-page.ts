import * as TE from 'fp-ts/TaskEither';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { toHtmlFragment } from '../../types/html-fragment';

type SaveArticlePage = TE.TaskEither<RenderPageError, Page>;

export const saveArticlePage = (): SaveArticlePage => TE.right({
  title: 'Save article page',
  content: toHtmlFragment(''),
});
