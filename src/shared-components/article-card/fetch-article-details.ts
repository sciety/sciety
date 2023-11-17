import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleAuthors } from '../../types/article-authors.js';
import { ArticleServer } from '../../types/article-server.js';
import * as DE from '../../types/data-error.js';
import { ArticleId } from '../../types/article-id.js';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment.js';

type GetArticle = (doi: ArticleId) => TE.TaskEither<DE.DataError, {
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  server: ArticleServer,
}>;

type GetLatestArticleVersionDate = (articleDoi: ArticleId, server: ArticleServer) => TO.TaskOption<Date>;

type FetchArticleDetails = (
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
  getArticle: GetArticle,
) => (doi: ArticleId) => TE.TaskEither<DE.DataError, {
  articleId: ArticleId,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
  server: ArticleServer,
}>;

export const fetchArticleDetails: FetchArticleDetails = (getLatestArticleVersionDate, getArticle) => (doi) => pipe(
  doi,
  getArticle,
  TE.chainW(({ authors, title, server }) => pipe(
    getLatestArticleVersionDate(doi, server),
    T.map((latestVersionDate) => ({
      latestVersionDate,
      authors,
      title,
      server,
      articleId: doi,
    })),
    TE.rightTask,
  )),
);
