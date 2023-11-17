import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { SupportedArticleServer } from './article-server-with-version-information.js';
import {
  biorxivDetailsApiResponse, ResponseWithVersions, responseWithVersions,
} from './biorxiv-details-api-response.js';
import { ArticleId } from '../../types/article-id.js';
import { QueryExternalService } from '../query-external-service.js';
import { Logger } from '../../shared-ports/index.js';

type Dependencies = {
  queryExternalService: QueryExternalService,
  logger: Logger,
};

const constructUrl = (doi: ArticleId, server: SupportedArticleServer) => (
  `https://api.biorxiv.org/details/${server}/${doi.value}`
);

type FetchArticleDetails = ({
  queryExternalService,
  logger,
}: Dependencies, doi: ArticleId, server: SupportedArticleServer)
=> TE.TaskEither<void, ResponseWithVersions>;

export const fetchArticleDetails: FetchArticleDetails = ({ queryExternalService, logger }, doi, server) => pipe(
  constructUrl(doi, server),
  queryExternalService(),
  TE.chainEitherKW(flow(
    biorxivDetailsApiResponse.decode,
    E.mapLeft((errors) => logger('error', 'Failed to parse biorxiv response', {
      errors: formatValidationErrors(errors).join('\n'),
      url: constructUrl(doi, server),
    })),
  )),
  TE.filterOrElseW(responseWithVersions.is, () => {
    logger('warn', 'No versions found on biorxiv/medrxiv', { doi, server });
  }),
  TE.mapLeft(() => undefined),
);
