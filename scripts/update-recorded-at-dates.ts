import { execSync } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { decodeEvaluationsFromJsonl } from '../src/infrastructure/evaluations-as-jsonl';
import { Doi } from '../src/types/doi';

const filename = './data/reviews/7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84.jsonl';

const readFromFile = promisify(fs.readFile);

const readTextFile = (path: string) => TE.tryCatch(
  async () => readFromFile(path, 'utf-8'),
  E.toError,
);

const runScript = (evaluationLocator: string): TE.TaskEither<unknown, Date> => pipe(
  TE.tryCatch(
    async () => execSync(`./scripts/first-commit-date-for-evaluation-locator.sh ${evaluationLocator}`),
    String,
  ),
  TE.map((buffer) => buffer.toString('utf-8')),
  TE.map((string) => string.trim()),
  TE.map((string) => new Date(string)),
);

const updateDate = (partialEvent: { evaluationLocator: string, articleDoi: Doi }) => pipe(
  partialEvent.evaluationLocator,
  runScript,
  TE.map((newDate) => ({
    ...partialEvent,
    date: newDate,
    articleDoi: partialEvent.articleDoi.value,
  })),
);

const processFile = (filePath: string) => pipe(
  filePath,
  readTextFile,
  T.map(E.orElse(() => E.right(''))),
  TE.chainEitherKW(decodeEvaluationsFromJsonl),
  TE.chainW(TE.traverseArray(updateDate)),
  TE.map(RA.map(
    (partialEvent) => process.stdout.write(`${JSON.stringify(partialEvent)}\n`),
  )),
);

void (async (): Promise<unknown> => pipe(
  processFile(filename),
)())();
