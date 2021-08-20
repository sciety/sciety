import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchData } from './fetch-data';
import { FetchEvaluations } from './update-all';

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

type CrossrefItem = {
  DOI: string,
  'published-print': {
    'date-parts': [
      [number, number, number],
    ],
  },
};

type CrossrefResponse = {
  message: {
    items: [CrossrefItem],
  },
};

type CrossrefReview = CrossrefItem & {
  biorxivDoi: string,
};

const crossrefReviewsUrl = (reviewDoiPrefix: string, articleDoi: string) => (
  `https://api.crossref.org/prefixes/${reviewDoiPrefix}/works?rows=1000&filter=type:peer-review,relation.object:${articleDoi}`
);

const getReviews = (reviewDoiPrefix: string) => (biorxivItem: BiorxivItem) => {
  const headers: Record<string, string> = (process.env.CROSSREF_API_BEARER_TOKEN !== undefined)
    ? { 'Crossref-Plus-API-Token': `Bearer ${process.env.CROSSREF_API_BEARER_TOKEN}` }
    : { };
  return pipe(
    fetchData<CrossrefResponse>(crossrefReviewsUrl(reviewDoiPrefix, biorxivItem.published_doi), headers),
    TE.map((response) => response.message.items),
    TE.map(RA.map((item) => ({
      ...item,
      biorxivDoi: biorxivItem.biorxiv_doi,
    }))),
  );
};

const toEvaluation = (review: CrossrefReview) => {
  const [year, month, day] = review['published-print']['date-parts'][0];
  const date = new Date(year, month - 1, day);
  const reviewDoi = review.DOI;
  return {
    date,
    articleDoi: review.biorxivDoi,
    evaluationLocator: `doi:${reviewDoi}`,
  };
};

const fetchPaginatedData = (baseUrl: string, offset: number): TE.TaskEither<string, ReadonlyArray<BiorxivItem>> => pipe(
  fetchData<BiorxivResponse>(`${baseUrl}/${offset}`),
  TE.map((response) => response.collection),
  TE.chain(RA.match(
    () => TE.right([]),
    (items) => pipe(
      fetchPaginatedData(baseUrl, offset + items.length),
      TE.map((next) => [...items, ...next]),
    ),
  )),
);

const identifyCandidates = (doiPrefix: string, reviewDoiPrefix: string) => {
  const startDate = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  const baseUrl = `https://api.biorxiv.org/publisher/${doiPrefix}/${startDate}/${today}`;
  return pipe(
    fetchPaginatedData(baseUrl, 0),
    TE.chain(TE.traverseArray(getReviews(reviewDoiPrefix))),
    TE.map(RA.flatten),
  );
};

export const fetchReviewsFromCrossrefViaBiorxiv = (
  doiPrefix: string,
  reviewDoiPrefix: string,
): FetchEvaluations => () => pipe(
  identifyCandidates(doiPrefix, reviewDoiPrefix),
  TE.map(RA.map(toEvaluation)),
  TE.map((evaluations) => ({
    evaluations,
    skippedItems: [],
  })),
);
