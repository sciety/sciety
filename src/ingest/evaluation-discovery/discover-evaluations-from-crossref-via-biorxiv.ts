import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ingestionWindowStartDate } from './ingestion-window-start-date';
import { Dependencies, DiscoverPublishedEvaluations } from '../discover-published-evaluations';
import { FetchData } from '../fetch-data';
import * as CR from '../third-parties/crossref';
import { constructPublishedEvaluation } from '../types/published-evaluation';
import { Environment } from '../validate-environment';

type BiorxivItem = {
  biorxiv_doi: string,
  published_doi: string,
};

type BiorxivResponse = {
  messages: Array<{
    cursor: number | string,
    count: number,
    total: number,
  }>,
  collection: Array<BiorxivItem>,
};

type CrossrefReview = CR.CrossrefItem & {
  biorxivDoi: string,
};

const getReviews = (fetchData: FetchData, crossrefApiBearerToken: Environment['crossrefApiBearerToken'], reviewDoiPrefix: string) => (biorxivItem: BiorxivItem) => pipe(
  biorxivItem.published_doi,
  CR.fetchReviewsBy(fetchData, crossrefApiBearerToken, reviewDoiPrefix),
  TE.map(RA.map((item) => ({
    ...item,
    biorxivDoi: biorxivItem.biorxiv_doi,
  }))),
);

const toEvaluation = (review: CrossrefReview) => {
  const [year, month, day] = review['published-print']['date-parts'][0];
  const date = new Date(year, month - 1, day);
  const reviewDoi = review.DOI;
  return constructPublishedEvaluation({
    publishedOn: date,
    paperExpressionDoi: review.biorxivDoi,
    evaluationLocator: `doi:${reviewDoi}`,
  });
};

const fetchPaginatedData = (
  dependencies: Dependencies,
  baseUrl: string,
  offset: number,
): TE.TaskEither<string, ReadonlyArray<BiorxivItem>> => pipe(
  dependencies.fetchData<BiorxivResponse>(`${baseUrl}/${offset}`),
  TE.map((response) => response.collection),
  TE.chain(RA.match(
    () => TE.right([]),
    (items) => pipe(
      fetchPaginatedData(dependencies, baseUrl, offset + items.length),
      TE.map((next) => [...items, ...next]),
    ),
  )),
);

const identifyCandidates = (
  dependencies: Dependencies,
  crossrefApiBearerToken: Environment['crossrefApiBearerToken'],
  doiPrefix: string,
  reviewDoiPrefix: string,
  ingestDays: number,
) => {
  const startDate = ingestionWindowStartDate(ingestDays).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  const baseUrl = `https://api.biorxiv.org/publisher/${doiPrefix}/${startDate}/${today}`;
  return pipe(
    fetchPaginatedData(dependencies, baseUrl, 0),
    TE.chain(TE.traverseSeqArray(getReviews(dependencies.fetchData, crossrefApiBearerToken, reviewDoiPrefix))),
    TE.map(RA.flatten),
  );
};

export const discoverEvaluationsFromCrossrefViaBiorxiv = (
  crossrefApiBearerToken: Environment['crossrefApiBearerToken'],
  doiPrefix: string,
  reviewDoiPrefix: string,
): DiscoverPublishedEvaluations => (ingestDays) => (dependencies) => pipe(
  identifyCandidates(dependencies, crossrefApiBearerToken, doiPrefix, reviewDoiPrefix, ingestDays),
  TE.map(RA.map(toEvaluation)),
  TE.map((evaluations) => ({
    understood: evaluations,
    skipped: [],
  })),
);
