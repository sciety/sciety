import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { ArticleId } from '../../types/article-id';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { ExpressionDoi } from '../../types/expression-doi';
import * as EDOI from '../../types/expression-doi';
import { ExternalQueries } from '../../third-parties';

type GetLatestArticleVersionDate = (expressionDoi: ExpressionDoi, server: ArticleServer) => TO.TaskOption<Date>;

type FetchArticleDetails = (
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
  getArticle: ExternalQueries['fetchArticle'],
) => (doi: ArticleId) => TE.TaskEither<DE.DataError, {
  articleId: ArticleId,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
  server: ArticleServer,
}>;

export const fetchArticleDetails: FetchArticleDetails = (
  getLatestArticleVersionDate,
  getArticle,
) => (articleId) => pipe(
  articleId,
  getArticle,
  TE.chainW(({ authors, title, server }) => pipe(
    getLatestArticleVersionDate(EDOI.fromValidatedString(articleId.value), server),
    T.map((latestVersionDate) => ({
      latestVersionDate,
      authors,
      title,
      server,
      articleId,
    })),
    TE.rightTask,
  )),
);
