import { execSync } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { decodeEvaluationsFromJsonl } from '../src/infrastructure/evaluations-as-jsonl';
import { Doi } from '../src/types/doi';

const filename = process.env.FILENAME ?? '';

const readFromFile = promisify(fs.readFile);

const readTextFile = (path: string) => TE.tryCatch(
  async () => readFromFile(path, 'utf-8'),
  E.toError,
);

const parseDate = (candidate: string): E.Either<string, Date> => pipe(
  candidate,
  (string) => new Date(string),
  E.right,
  E.filterOrElse(
    (d) => d.toString() !== 'Invalid Date',
    () => `Tried to build a Date from an invalid string: "${candidate}"`,
  ),
);

const runScript = (evaluationIndex: number, evaluationLocator: string): TE.TaskEither<string, Date> => pipe(
  TE.tryCatch(
    async () => {
      const output = execSync(`./scripts/first-commit-date-for-evaluation-locator.sh ${evaluationLocator}`);
      process.stderr.write(`Processed evaluation ${evaluationIndex} (${evaluationLocator})\n`);
      return output;
    },
    String,
  ),
  TE.map((buffer) => buffer.toString('utf-8')),
  TE.map((string) => string.trim()),
  TE.chainEitherK(parseDate),
);

const updateDate = (
  evaluationIndex: number,
  partialEvent: { evaluationLocator: string, articleDoi: Doi },
) => pipe(
  runScript(evaluationIndex, partialEvent.evaluationLocator),
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
  TE.chainEitherKW(flow(
    decodeEvaluationsFromJsonl,
    E.mapLeft((errors) => errors.join('\n')),
  )),
  TE.chainW(TE.traverseArrayWithIndex(updateDate)),
  TE.bimap(
    (e) => { process.stderr.write(e.toString()); },
    RA.map(
      (partialEvent) => process.stdout.write(`${JSON.stringify(partialEvent)}\n`),
    ),
  ),
);

void (async (): Promise<unknown> => pipe(
  processFile(filename),
)())();
