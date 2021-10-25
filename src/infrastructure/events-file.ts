import fs from 'fs';
import { promisify } from 'util';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { decodeEvaluationsFromJsonl, ReadableEvaluations } from './evaluations-as-jsonl';

const readFromFile = promisify(fs.readFile);

const readTextFile = (path: string) => TE.tryCatch(
  async () => readFromFile(path, 'utf-8'),
  E.toError,
);

export const evaluationEventsFilepathForGroupId = (groupId: string): string => `./data/reviews/${groupId}.jsonl`;

export const readEventsFile = (filePath: string): TE.TaskEither<Array<string>, ReadableEvaluations> => pipe(
  filePath,
  readTextFile,
  T.map(E.orElse(() => E.right(''))),
  TE.chainEitherKW(decodeEvaluationsFromJsonl),
);
