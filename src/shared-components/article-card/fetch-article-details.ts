import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type GetArticle = (doi: Doi) => TE.TaskEither<DE.DataError, {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ReadonlyArray<string>,
}>;

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

type FetchArticleDetails = (
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
  getArticle: GetArticle,
) => (doi: Doi) => TE.TaskEither<DE.DataError, {
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  latestVersionDate: O.Option<Date>,
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
    })),
    TE.rightTask,
  )),
);
