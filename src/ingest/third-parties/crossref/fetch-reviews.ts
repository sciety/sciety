import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchData } from '../../fetch-data';
import { Environment } from '../../validate-environment';

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

const headers = (crossrefApiBearerToken: Environment['crossrefApiBearerToken']): Record<string, string> => ({ 'Crossref-Plus-API-Token': `Bearer ${crossrefApiBearerToken}` });

type FetchReviews =
(fetchData: FetchData, crossrefBearerToken: Environment['crossrefApiBearerToken'], reviewDoiPrefix: string) =>
(articleDoi: string) =>
TE.TaskEither<string, ReadonlyArray<CrossrefItem>>;

export const fetchReviewsBy: FetchReviews = (
  fetchData,
  crossrefApiBearerToken,
  reviewDoiPrefix,
) => (
  articleDoi,
) => pipe(
  fetchData<CrossrefResponse>(crossrefReviewsUrl(reviewDoiPrefix, articleDoi), headers(crossrefApiBearerToken)),
  TE.map((response) => response.message.items),
);
