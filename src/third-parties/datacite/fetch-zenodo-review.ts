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

// key: 10.5281/zenodo.6386692

export const fetchZenodoReview = (fetchDataset: FetchDataset, logger: Logger): EvaluationFetcher => flow(
  (key) => key.split('.')[2],
  (zenodoId) => `https://zenodo.org/api/records/${zenodoId}`,
  (url) => {
    logger('debug', 'Fetching evaluation from Datacite', { url });
    return url;
  },
  (url) => {
    const res = TE.tryCatch(
      async () => axios.get <Json>(url),
      () => DE.unavailable,
    );
    return pipe(
      res,
      TE.map((axiosResponse) => ({
        fullText: toHtmlFragment(axiosResponse.data.metadata.description),
        url: new URL('http://sciety.org'),
      })),
    );
  },
);
