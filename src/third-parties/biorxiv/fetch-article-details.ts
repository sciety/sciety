import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { SupportedArticleServer } from './article-server-with-version-information';
import { biorxivDetailsApiResponse, ResponseWithVersions, isResponseWithVersions } from './biorxiv-details-api-response';
import { Logger } from '../../infrastructure/logger';
import { Doi } from '../../types/doi';
import { GetJson } from '../../shared-ports';
import { getJsonAndLog } from '../get-json-and-log';

type Dependencies = {
  getJson: GetJson,
  logger: Logger,
};

const constructUrl = (doi: Doi, server: SupportedArticleServer) => (
  `https://api.biorxiv.org/details/${server}/${doi.value}`
);

type FetchArticleDetails = ({ getJson, logger }: Dependencies, doi: Doi, server: SupportedArticleServer)
=> TE.TaskEither<void, ResponseWithVersions>;

export const fetchArticleDetails: FetchArticleDetails = ({ getJson, logger }, doi, server) => pipe(
  constructUrl(doi, server),
  getJsonAndLog({ getJson, logger }),
  TE.chainEitherKW(flow(
    biorxivDetailsApiResponse.decode,
    E.mapLeft((errors) => logger('error', 'Failed to parse biorxiv response', {
      errors: formatValidationErrors(errors).join('\n'),
      url: constructUrl(doi, server),
    })),
  )),
  TE.filterOrElseW(isResponseWithVersions, () => {
    logger('warn', 'No version found on biorxiv/medrxiv', { doi, server });
  }),
  TE.mapLeft(() => undefined),
);
