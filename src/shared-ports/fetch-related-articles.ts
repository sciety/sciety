import * as TE from 'fp-ts/TaskEither';
import { ArticleAuthors } from '../types/article-authors';
import { Doi } from '../types/doi';
import * as DE from '../types/data-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

// ts-unused-exports:disable-next-line
export type RelatedArticles = ReadonlyArray<{
  articleId: Doi,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
}>;

export type FetchRelatedArticles = (doi: Doi)
=> TE.TaskEither<DE.DataError, RelatedArticles>;
