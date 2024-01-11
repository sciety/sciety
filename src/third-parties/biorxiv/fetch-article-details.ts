import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { SupportedArticleServer } from './article-server-with-version-information';
import {
  biorxivDetailsApiResponse, ResponseWithVersions, responseWithVersions,
} from './biorxiv-details-api-response';
import { ArticleId } from '../../types/article-id';
import { QueryExternalService } from '../query-external-service';
import { Logger } from '../../shared-ports';
import { decodeAndLogFailures } from '../decode-and-log-failures';

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
=> TE.TaskEither<DE.DataError, ResponseWithVersions>;

export const fetchArticleDetails: FetchArticleDetails = ({ queryExternalService, logger }, doi, server) => pipe(
  constructUrl(doi, server),
  queryExternalService(),
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, biorxivDetailsApiResponse, 'fetchArticleDetails', { url: constructUrl(doi, server) }),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.filterOrElseW(responseWithVersions.is, () => {
    logger('warn', 'No versions found on biorxiv/medrxiv', { doi, server });
    return DE.notFound;
  }),
);
