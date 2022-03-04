import * as E from 'fp-ts/Either';
import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { biorxivArticleDetails, BiorxivArticleDetails } from './BiorxivArticleDetails';
import { Logger } from '../../infrastructure/logger';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';

type GetJson = (url: string, headers: Record<string, string>) => Promise<Json>;

type Dependencies = {
  getJson: GetJson,
  logger: Logger,
};

const headers = {
  'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
};

const constructUrl = (doi: Doi, server: ArticleServer) => (
  `https://api.biorxiv.org/details/${server}/${doi.value}`
);

type FetchArticleDetails = (doi: Doi, server: ArticleServer)
=> ({ getJson, logger }: Dependencies)
=> TE.TaskEither<void, BiorxivArticleDetails>;

export const fetchArticleDetails: FetchArticleDetails = (doi, server) => ({ getJson, logger }) => pipe(
  TE.tryCatch(
    async () => getJson(
      constructUrl(doi, server),
      headers,
    ),
    E.toError,
  ),
  TE.chainEitherK(flow(
    biorxivArticleDetails.decode,
    E.mapLeft(flow(formatValidationErrors, (errors) => errors.join('\n'), Error)),
  )),
  TE.mapLeft(
    (error) => {
      logger('debug', 'Failed to retrieve article details from bioRxiv API', {
        url: constructUrl(doi, server),
        error: error.message,
      });
      return undefined;
    },
  ),
);
