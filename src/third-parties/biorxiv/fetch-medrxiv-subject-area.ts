import { Json } from 'fp-ts/Json';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { BiorxivArticleDetails } from './BiorxivArticleDetails';
import { makeRequest } from './get-article-version-events-from-biorxiv';
import { Logger } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';

type GetJson = (url: string, headers: Record<string, string>) => Promise<Json>;

type Ports = {
  getJson: GetJson,
  logger: Logger,
};

const mapResponse = flow(
  (response: BiorxivArticleDetails) => response.collection,
  RNEA.head,
  ({ category }) => category,
);

type FetchMedrvixSubjectArea = (ports: Ports) => (articleId: Doi) => TE.TaskEither<DE.DataError, string>;

// ts-unused-exports:disable-next-line
export const fetchMedrxivSubjectArea: FetchMedrvixSubjectArea = (ports) => (articleId) => pipe(
  makeRequest(articleId, 'medrxiv')(ports),
  TE.bimap(
    () => DE.unavailable,
    mapResponse,
  ),
);
