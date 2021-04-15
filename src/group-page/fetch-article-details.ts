import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
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

const hardcodedArticleDetails = [
  {
    doi: new Doi('10.1101/2020.09.15.286153'),
  },
  {
    doi: new Doi('10.1101/2019.12.20.884056'),
  },
  {
    doi: new Doi('10.1101/760082'),
  },
  {
    doi: new Doi('10.1101/661249'),
  },
];

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

export const fetchArticleDetails: FetchArticleDetails = (getLatestArticleVersionDate, getArticle) => (doi) => pipe(
  TO.Do,
  TO.apS('hardcodedDetails', pipe(
    hardcodedArticleDetails,
    RA.findFirst((articleDetails) => articleDetails.doi.value === doi.value),
    T.of,
  )),
  TO.apS('article', getArticle(doi)),
  TO.bind('latestVersionDate', ({ article }) => pipe(
    [doi, article.server],
    tupled(getLatestArticleVersionDate),
  )),
  TO.map(({ hardcodedDetails, latestVersionDate, article }) => ({
    ...hardcodedDetails,
    title: article.title,
    authors: article.authors,
    latestVersionDate,
  })),
);
