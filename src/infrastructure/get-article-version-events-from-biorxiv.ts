import { URL } from 'url';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { BiorxivArticleDetails, BiorxivArticleVersion } from './codecs/BiorxivArticleDetails';
import { Logger } from './logger';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';

type GetJson = (url: string) => Promise<Json>;

type GetArticleVersionEventsFromBiorxiv = (doi: Doi, server: ArticleServer) => T.Task<ReadonlyArray<{
  source: URL,
  occurredAt: Date,
  version: number,
}>>;

const getArticleVersionEventsFromBiorxiv = (
  getJson: GetJson,
  logger: Logger,
): GetArticleVersionEventsFromBiorxiv => (doi, server) => pipe(
  TE.tryCatch(
    async () => getJson(`https://api.biorxiv.org/details/${server}/${doi.value}`),
    E.toError,
  ),
  TE.chain(flow(
    BiorxivArticleDetails.decode,
    TE.fromEither,
    TE.mapLeft((e) => new Error(PR.failure(e).join('\n'))),
  )),
  TE.map((v) => v.collection),
  TE.map(A.map((v: BiorxivArticleVersion) => ({
    source: new URL(`https://www.${server}.org/content/${doi.value}v${v.version}`),
    occurredAt: new Date(v.date),
    version: v.version,
  }))),
  TE.getOrElseW(
    (error: Error) => {
      logger('error', 'Failed to retrieve article versions', { doi, message: error.message });
      return T.of([]);
    },
  ),
);

export { getArticleVersionEventsFromBiorxiv, GetArticleVersionEventsFromBiorxiv, GetJson };
