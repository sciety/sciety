import * as Ord from 'fp-ts/Ord';
import * as B from 'fp-ts/boolean';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import { ResponseWithVersions, BiorxivArticleVersion } from './biorxiv-details-api-response';
import { fetchArticleDetails } from './fetch-article-details';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { QueryExternalService } from '../query-external-service';
import { ExternalQueries } from '../external-queries';
import * as EDOI from '../../types/expression-doi';

type Dependencies = {
  queryExternalService: QueryExternalService,
  logger: Logger,
};

const byVersionAscending: Ord.Ord<BiorxivArticleVersion> = pipe(
  N.Ord,
  Ord.contramap((articleVersion) => articleVersion.version),
);

const mapResponse = flow(
  (response: ResponseWithVersions) => response.collection,
  RNEA.sort(byVersionAscending),
  RNEA.last,
  ({ category, server }) => ({ value: category, server }),
);

export const getBiorxivOrMedrxivCategory = (dependencies: Dependencies): ExternalQueries['getArticleSubjectArea'] => (articleId) => pipe(
  articleId.value,
  EDOI.fromValidatedString,
  EDOI.hasPrefix('10.1101'),
  B.match(
    () => E.left(DE.unavailable),
    () => E.right([
      'biorxiv' as const,
      'medrxiv' as const,
    ]),
  ),
  T.of,
  TE.chainTaskK(T.traverseArray((server) => fetchArticleDetails(dependencies, articleId, server))),
  TE.map(RA.rights),
  TE.chainOptionK(() => DE.unavailable)(RA.head),
  TE.map(mapResponse),
);
