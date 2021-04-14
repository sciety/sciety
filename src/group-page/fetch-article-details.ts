import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer,
) => T.Task<O.Option<RNEA.ReadonlyNonEmptyArray<{ occurredAt: Date }>>>;

type GetArticle = (doi: Doi) => TO.TaskOption<{
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<SanitisedHtmlFragment>,
  server: ArticleServer,
}>;

type FetchArticleDetails = (
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
  getArticle: GetArticle,
) => (doi: Doi) => TO.TaskOption<{
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<SanitisedHtmlFragment>,
  latestVersionDate: Date,
}>;

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => T.Task<O.Option<Date>>;

export const fetchArticleDetails: FetchArticleDetails = (getLatestArticleVersionDate, getArticle) => (doi) => pipe(
  TO.Do,
  TO.bind('article', () => getArticle(doi)),
  TO.bind('latestVersionDate', ({ article }) => pipe(
    [doi, article.server],
    tupled(getLatestArticleVersionDate),
  )),
  TO.map(({ latestVersionDate, article }) => ({
    title: article.title,
    authors: article.authors,
    latestVersionDate,
  })),
);
