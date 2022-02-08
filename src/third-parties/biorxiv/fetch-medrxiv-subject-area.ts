import { Json } from 'fp-ts/Json';
import * as Ord from 'fp-ts/Ord';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import { BiorxivArticleDetails, BiorxivArticleVersion } from './BiorxivArticleDetails';
import { fetchArticleDetails } from './fetch-article-details';
import { Logger } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';

type GetJson = (url: string, headers: Record<string, string>) => Promise<Json>;

type Ports = {
  getJson: GetJson,
  logger: Logger,
};

const byVersionAscending: Ord.Ord<BiorxivArticleVersion> = pipe(
  N.Ord,
  Ord.contramap((articleVersion) => articleVersion.version),
);

const mapResponse = flow(
  (response: BiorxivArticleDetails) => response.collection,
  RNEA.sort(byVersionAscending),
  RNEA.last,
  ({ category }) => category,
);

type FetchMedrvixSubjectArea = (ports: Ports) => (articleId: Doi) => TE.TaskEither<DE.DataError, string>;

export const fetchMedrxivSubjectArea: FetchMedrvixSubjectArea = (ports) => (articleId) => pipe(
  fetchArticleDetails(articleId, 'medrxiv')(ports),
  TE.bimap(
    () => DE.unavailable,
    mapResponse,
  ),
);
