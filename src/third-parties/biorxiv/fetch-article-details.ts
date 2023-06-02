import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { ArticleServerWithVersionInformation } from '../../types/article-server-with-version-information';
import { biorxivArticleDetails, BiorxivArticleDetails } from './BiorxivArticleDetails';
import { Logger } from '../../infrastructure/logger';
import { Doi } from '../../types/doi';
import { GetJson } from '../../shared-ports';
import { getJsonAndLog } from '../get-json-and-log';

type Dependencies = {
  getJson: GetJson,
  logger: Logger,
};

const constructUrl = (doi: Doi, server: ArticleServerWithVersionInformation) => (
  `https://api.biorxiv.org/details/${server}/${doi.value}`
);

type FetchArticleDetails = (doi: Doi, server: ArticleServerWithVersionInformation)
=> ({ getJson, logger }: Dependencies)
=> TE.TaskEither<void, BiorxivArticleDetails>;

export const fetchArticleDetails: FetchArticleDetails = (doi, server) => ({ getJson, logger }) => pipe(
  constructUrl(doi, server),
  getJsonAndLog({ getJson, logger }),
  TE.chainEitherKW(flow(
    biorxivArticleDetails.decode,
    E.mapLeft((errors) => logger('error', 'Failed to parse biorxiv response', {
      errors: formatValidationErrors(errors).join('\n'),
      url: constructUrl(doi, server),
    })),
  )),
  TE.mapLeft(() => undefined),
);
