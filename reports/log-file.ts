import * as fs from 'fs';
import * as E from 'fp-ts/Either';
import * as Json from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { dateFromIngressLogString } from './date-from-ingress-log-string';

const logEntryFromIngressLog = t.type({
  http_user_agent: t.string,
  request: t.string,
  remote_addr: t.string,
  time_local: dateFromIngressLogString,
});

const logsFromJson = t.array(logEntryFromIngressLog);

export type Logs = t.TypeOf<typeof logsFromJson>;

const parseFile = flow(
  Json.parse,
  E.chainW(logsFromJson.decode),
  E.mapLeft((e) => e as Error),
);

const convertToValidJson = flow(
  (input: string) => input.split('\n'),
  RA.filter((line) => line.startsWith('{')),
  (lines) => lines.join(','),
  (entries) => `[${entries}]`,
);

export const read = (filename: string): TE.TaskEither<string, Logs> => pipe(
  filename,
  TE.taskify(fs.readFile),
  TE.map((buffer) => buffer.toString()),
  TE.map(convertToValidJson),
  TE.chainEitherKW(parseFile),
  TE.mapLeft((e) => e.toString()),
);
