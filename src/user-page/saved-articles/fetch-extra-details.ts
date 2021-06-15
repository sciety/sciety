import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { ArticleViewModel } from '../../shared-components/article-card';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type ArticleItem = {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
};

export type Ports = {
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  occurredAt: Date,
}>>;

type GetLatestActivityDate = (reviews: ReadonlyArray<{ occurredAt: Date }>) => O.Option<Date>;

const getLatestActivityDate: GetLatestActivityDate = flow(
  RA.last,
  O.map(({ occurredAt }) => occurredAt),
);

export const populateArticleViewModel = (ports: Ports) => (item: ArticleItem): T.Task<ArticleViewModel> => pipe(
  T.Do,
  T.apS('reviews', pipe(item.doi, ports.findReviewsForArticleDoi)),
  T.apS('latestVersionDate', getLatestArticleVersionDate(ports.findVersionsForArticleDoi)(item.doi, item.server)),
  T.bind('latestActivityDate', ({ reviews }) => pipe(reviews, getLatestActivityDate, T.of)),
  T.bind('evaluationCount', ({ reviews }) => pipe(reviews.length, T.of)),
  T.map(({ latestVersionDate, latestActivityDate, evaluationCount }) => ({
    ...item,
    latestVersionDate,
    latestActivityDate,
    evaluationCount,
  })),
);
