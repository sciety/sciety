import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import axios from 'axios';
import * as E from 'fp-ts/Either';
import { axiosGet } from './fetch-data';
import { batchTaskTraverse } from './batch-traverse';

type BiorxivResponse = {
  collection: ReadonlyArray<{
    doi: string,
    date: string,
    version: string,
  }>,
};

const send = (command: unknown) => TE.tryCatch(
  async () => axios.post(`${process.env.INGESTION_TARGET_APP ?? 'http://app'}/api/record-article-version`, JSON.stringify(command), {
    headers: {
      Authorization: `Bearer ${process.env.SCIETY_TEAM_API_BEARER_TOKEN ?? 'secret'}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  }),
  (error) => {
    if (axios.isAxiosError(error)) {
      return `Failed to post evaluation command: ${String(error)}. Response data is: "${String(error.response?.data)}"`;
    }
    return `Failed to post evaluation command: ${String(error)}`;
  },
);

const sendRecordArticleVersionCommands = (commands: ReadonlyArray<unknown>) => pipe(
  commands,
  batchTaskTraverse(send, 1),
  T.map((array) => {
    const leftsCount = RA.lefts(array).length;
    const lefts = pipe(
      array,
      RA.lefts,
      RA.size,
    );
    const rightsCount = RA.rights(array).length;
    const summaryOfRequests = {
      lefts,
      leftsTotal: leftsCount,
      rightsTotal: rightsCount,
    };
    if (leftsCount > 0) {
      return E.left(summaryOfRequests);
    }
    return E.right(summaryOfRequests);
  }),
);

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
  TE.chainW(sendRecordArticleVersionCommands),
);

void (async (): Promise<unknown> => pipe(
  recordAll(),
  TE.match(
    () => 1,
    () => 0,
  ),
  T.map((exitCode) => process.exit(exitCode)),
)())();
