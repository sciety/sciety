import { URL } from 'url';
import axios from 'axios';
import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { FetchDataset } from '../../infrastructure/fetch-dataset';
import { EvaluationFetcher } from '../../infrastructure/fetch-review';
import { Logger } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

export const fetchDataciteReview = (fetchDataset: FetchDataset, logger: Logger): EvaluationFetcher => flow(
  (key) => `https://data.crosscite.org/${encodeURIComponent(key)}`,
  (url) => {
    logger('debug', 'Fetching evaluation from Datacite', { url });
    return url;
  },
  (url) => {
    const res = TE.tryCatch(
      async () => axios.get <Json>(url, {
        headers: {
          Accept: 'application/vnd.codemeta.ld+json',
        },
      }),
      () => DE.unavailable,
    );
    return pipe(
      res,
      TE.map((axiosResponse) => ({
        fullText: toHtmlFragment(axiosResponse.data.description),
        url: new URL('http://sciety.org'),
      })),
    );
  },
);
