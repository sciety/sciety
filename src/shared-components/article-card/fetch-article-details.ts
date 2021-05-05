import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type GetArticle = (doi: Doi) => TO.TaskOption<{
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ReadonlyArray<string>,
}>;

type FetchArticleDetails = (
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
  getArticle: GetArticle,
) => (doi: Doi) => TO.TaskOption<{
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  latestVersionDate: O.Option<Date>,
}>;

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

export const fetchArticleDetails: FetchArticleDetails = (getLatestArticleVersionDate, getArticle) => (doi) => pipe(
  doi,
  getArticle,
  TO.bind('latestVersionDate', ({ server }) => pipe(
    getLatestArticleVersionDate(doi, server),
    T.map(O.some),
  )),
);
