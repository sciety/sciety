import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchData } from '../fetch-data';

export type CrossrefItem = {
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

const crossrefReviewsUrl = (reviewDoiPrefix: string, articleDoi: string) => (
  `https://api.crossref.org/prefixes/${reviewDoiPrefix}/works?rows=1000&filter=type:peer-review,relation.object:${articleDoi}`
);

const headers: Record<string, string> = (process.env.CROSSREF_API_BEARER_TOKEN !== undefined)
  ? { 'Crossref-Plus-API-Token': `Bearer ${process.env.CROSSREF_API_BEARER_TOKEN}` }
  : { };

type FetchReviews =
(reviewDoiPrefix: string) =>
(articleDoi: string) =>
TE.TaskEither<string, ReadonlyArray<CrossrefItem>>;

export const fetchReviewsBy: FetchReviews = (reviewDoiPrefix) => (articleDoi) => pipe(
  fetchData<CrossrefResponse>(crossrefReviewsUrl(reviewDoiPrefix, articleDoi), headers),
  TE.map((response) => response.message.items),
);
