import axios from 'axios';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
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

const getReviews = (reviewDoiPrefix: string) => (biorxivItem: BiorxivItem) => async () => {
  const headers: Record<string, string> = {
    'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
  };
  if (process.env.CROSSREF_API_BEARER_TOKEN !== undefined) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${process.env.CROSSREF_API_BEARER_TOKEN}`;
  }
  const { data } = await axios.get<CrossrefResponse>(
    crossrefReviewsUrl(reviewDoiPrefix, biorxivItem.published_doi),
    { headers },
  );
  return data.message.items.map((item) => ({
    ...item,
    biorxivDoi: biorxivItem.biorxiv_doi,
  }));
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

const fetchPaginatedData = (baseUrl: string, offset: number): T.Task<ReadonlyArray<BiorxivItem>> => pipe(
  fetchData<BiorxivResponse>(`${baseUrl}/${offset}`),
  TE.fold(
    (error) => { console.log(error); return T.of([]); },
    (data) => T.of(data.collection),
  ),
  T.chain(RA.match(
    () => T.of([]),
    (items) => pipe(
      fetchPaginatedData(baseUrl, offset + items.length),
      T.map((next) => [...items, ...next]),
    ),
  )),
);

const identifyCandidates = (doiPrefix: string, reviewDoiPrefix: string) => {
  const startDate = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  const baseUrl = `https://api.biorxiv.org/publisher/${doiPrefix}/${startDate}/${today}`;
  return pipe(
    fetchPaginatedData(baseUrl, 0),
    T.chain(T.traverseArray(getReviews(reviewDoiPrefix))),
    T.map(RA.flatten),
  );
};

export const fetchReviewsFromCrossrefViaBiorxiv = (
  doiPrefix: string,
  reviewDoiPrefix: string,
): FetchEvaluations => () => pipe(
  identifyCandidates(doiPrefix, reviewDoiPrefix),
  T.map(RA.map(toEvaluation)),
  T.map((evaluations) => ({
    evaluations,
    skippedItems: [],
  })),
  TE.rightTask,
);
