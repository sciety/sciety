import fs from 'fs';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

export const readTextFile = (filePath: string): TE.TaskEither<unknown, string> => pipe(
  TE.taskify((callback) => fs.readFile(filePath, 'utf8', callback))(),
  TE.map((foo) => foo as string),
);
