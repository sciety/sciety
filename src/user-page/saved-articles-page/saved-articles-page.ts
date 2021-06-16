import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';

type SavedArticlesPage = () => TE.TaskEither<RenderPageError, Page>;

export const savedArticlesPage: SavedArticlesPage = () => TE.right({
  title: 'User\'s saved articles',
  content: toHtmlFragment(''),
});
