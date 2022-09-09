import * as TE from 'fp-ts/TaskEither';
import { ArticleAuthors } from '../types/article-authors';
import { ArticleServer } from '../types/article-server';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type FetchArticle = (doi: Doi) => TE.TaskEither<DE.DataError, {
  abstract: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  doi: Doi,
  title: SanitisedHtmlFragment,
  server: ArticleServer,
}>;
