import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { ArticleViewModel } from '../../shared-components/article-card';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type ArticleItem = {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};

export type FindReviewsForArticleDoi = (articleDoi: Doi) => TE.TaskEither<DE.DataError, ReadonlyArray<{
  publishedAt: Date,
}>>;

type GetLatestArticleVersionDate = (articleDoi: Doi, server: ArticleServer) => TO.TaskOption<Date>;

type Ports = {
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getLatestArticleVersionDate: GetLatestArticleVersionDate,
};

type GetLatestActivityDate = (reviews: ReadonlyArray<{ publishedAt: Date }>) => O.Option<Date>;

const getLatestActivityDate: GetLatestActivityDate = flow(
  RA.last,
  O.map(({ publishedAt }) => publishedAt),
);

export const populateArticleViewModel = (
  ports: Ports,
) => (item: ArticleItem): TE.TaskEither<DE.DataError, ArticleViewModel> => pipe(
  item.doi,
  ports.findReviewsForArticleDoi,
  TE.chainTaskK(flow(
    (reviews) => ({
      latestVersionDate: ports.getLatestArticleVersionDate(item.doi, item.server),
      latestActivityDate: pipe(reviews, getLatestActivityDate, T.of),
      evaluationCount: T.of(reviews.length),
    }),
    sequenceS(T.ApplyPar),
  )),
  TE.map(({ latestVersionDate, latestActivityDate, evaluationCount }) => ({
    ...item,
    latestVersionDate,
    latestActivityDate,
    evaluationCount,
  })),
);
