import * as TE from 'fp-ts/TaskEither';
import { Queries } from '../../../shared-read-models';
import { Doi } from '../../../types/doi';
import * as DE from '../../../types/data-error';
import { SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment';
import { ArticleServer } from '../../../types/article-server';
import { ArticleAuthors } from '../../../types/article-authors';
import {
  FetchRelatedArticles, FetchReview, FindVersionsForArticleDoi, Logger,
} from '../../../shared-ports';

type GetArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  server: ArticleServer,
  authors: ArticleAuthors,
}>;

export type Dependencies = Queries & {
  fetchArticle: GetArticleDetails,
  fetchRelatedArticles: FetchRelatedArticles,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  logger: Logger,
};
