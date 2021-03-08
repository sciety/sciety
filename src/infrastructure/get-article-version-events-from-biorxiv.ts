import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as RT from 'fp-ts/ReaderTask';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { biorxivArticleDetails, BiorxivArticleDetails } from './codecs/BiorxivArticleDetails';
import { Logger } from './logger';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';

type GetJson = (url: string) => Promise<Json>;

type Dependencies = {
  getJson: GetJson,
  logger: Logger,
};

type ArticleVersion = {
  source: URL,
  occurredAt: Date,
  version: number,
};

type GetArticleVersionEventsFromBiorxiv = (
  doi: Doi,
  server: ArticleServer,
) => RT.ReaderTask<Dependencies, ReadonlyArray<ArticleVersion>>;

const makeRequest = (doi: Doi, server: ArticleServer) => ({ getJson, logger }: Dependencies) => pipe(
  TE.tryCatch(
    async () => getJson(`https://api.biorxiv.org/details/${server}/${doi.value}`),
    E.toError,
  ),
  TE.chainEitherK(flow(
    biorxivArticleDetails.decode,
    E.mapLeft((errors) => new Error(PR.failure(errors).join('\n'))),
  )),
  TE.swap,
  TE.chainFirstW(flow(
    (error) => logger('error', 'Failed to retrieve article versions', { doi, message: error.message }),
    TE.right,
  )),
  TE.swap,
);

const mapResponse = (doi: Doi, server: ArticleServer) => flow(
  (response: BiorxivArticleDetails) => response.collection,
  RNEA.map(({ version, date }) => ({
    source: new URL(`https://www.${server}.org/content/${doi.value}v${version}`),
    occurredAt: date,
    version,
  })),
);

const getArticleVersionEventsFromBiorxiv: GetArticleVersionEventsFromBiorxiv = (doi, server) => pipe(
  makeRequest(doi, server),
  RTE.map(mapResponse(doi, server)),
  RTE.getOrElseW(() => RT.of([])),
);

export { getArticleVersionEventsFromBiorxiv, ArticleVersion };
