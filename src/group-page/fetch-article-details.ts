import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe, tupled } from 'fp-ts/function';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer,
) => T.Task<O.Option<RNEA.ReadonlyNonEmptyArray<{ occurredAt: Date }>>>;

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
  latestVersionDate: Date,
}>;

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

export const fetchArticleDetails: FetchArticleDetails = (getLatestArticleVersionDate, getArticle) => (doi) => pipe(
  doi,
  getArticle,
  TO.bind('latestVersionDate', ({ server }) => pipe(
    [doi, server],
    tupled(getLatestArticleVersionDate),
  )),
);
