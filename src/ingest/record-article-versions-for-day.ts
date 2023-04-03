import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { axiosGet } from './fetch-data';

type BiorxivResponse = {
  collection: ReadonlyArray<{
    doi: string,
    date: string,
    version: string,
  }>,
};

export const recordAll = (): TE.TaskEither<unknown, unknown> => pipe(
  TE.tryCatch(
    async () => axiosGet<BiorxivResponse>('https://api.biorxiv.org/details/biorxiv/2023-04-02/2023-04-02', {}),
    String,
  ),
  TE.map((response) => pipe(
    response.data.collection,
    RA.map((biorxivArticleVersion) => ({
      articleId: biorxivArticleVersion.doi,
      version: Number.parseInt(biorxivArticleVersion.version, 10),
      publishedAt: biorxivArticleVersion.date,
    })),
  )),
  TE.map((commands) => {
    console.log(commands);
    return;
  }),
);

void (async (): Promise<unknown> => pipe(
  recordAll(),
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();
