import * as TE from 'fp-ts/TaskEither';
import { ArticleAuthors } from '../types/article-authors.js';
import { ArticleId } from '../types/article-id.js';
import * as DE from '../types/data-error.js';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment.js';

export type RelatedArticles = ReadonlyArray<{
  articleId: ArticleId,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
}>;

export type FetchRelatedArticles = (doi: ArticleId)
=> TE.TaskEither<DE.DataError, RelatedArticles>;
