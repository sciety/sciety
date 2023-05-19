import { Json } from 'fp-ts/Json';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import { BiorxivArticleDetails, BiorxivArticleVersion } from './BiorxivArticleDetails';
import { fetchArticleDetails } from './fetch-article-details';
import { Logger } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { ExternalQueries } from '../../types/external-queries';

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
  ({ category, server }) => ({ value: category, server }),
);

export const getBiorxivOrMedrxivCategory = (ports: Ports): ExternalQueries['getArticleSubjectArea'] => (articleId) => pipe(
  [
    'biorxiv' as const,
    'medrxiv' as const,
  ],
  T.traverseArray((server) => fetchArticleDetails(articleId, server)(ports)),
  T.map(RA.rights),
  T.map(RA.head),
  TE.fromTaskOption(() => DE.unavailable),
  TE.map(mapResponse),
);
