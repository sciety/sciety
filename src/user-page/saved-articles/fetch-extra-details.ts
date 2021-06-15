import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import { ArticleViewModel } from '../../shared-components/article-card';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type ArticleItem = {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
};

type Ports = {
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
};

type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  occurredAt: Date,
}>>;

type GetLatestActivityDate = (reviews: ReadonlyArray<{ occurredAt: Date }>) => O.Option<Date>;

const getLatestActivityDate: GetLatestActivityDate = flow(
  RA.last,
  O.map(({ occurredAt }) => occurredAt),
);

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

// ts-unused-exports:disable-next-line
export const populateArticleViewModel = (ports: Ports) => (item: ArticleItem): T.Task<ArticleViewModel> => pipe(
  T.Do,
  T.apS('reviews', pipe(item.doi, ports.findReviewsForArticleDoi)),
  T.apS('latestVersionDate', pipe([item.doi, item.server], tupled(ports.getLatestArticleVersionDate))),
  T.bind('latestActivityDate', ({ reviews }) => pipe(reviews, getLatestActivityDate, T.of)),
  T.bind('evaluationCount', ({ reviews }) => pipe(reviews.length, T.of)),
  T.map(({ latestVersionDate, latestActivityDate, evaluationCount }) => ({
    ...item,
    latestVersionDate,
    latestActivityDate,
    evaluationCount,
  })),
);
