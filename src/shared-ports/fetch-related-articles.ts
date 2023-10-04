import * as TE from 'fp-ts/TaskEither';
import { ArticleAuthors } from '../types/article-authors';
import { ArticleId } from '../types/article-id';
import * as DE from '../types/data-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type RelatedArticles = ReadonlyArray<{
  articleId: ArticleId,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
}>;

export type FetchRelatedArticles = (doi: ArticleId)
=> TE.TaskEither<DE.DataError, RelatedArticles>;
