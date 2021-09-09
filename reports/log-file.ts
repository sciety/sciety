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

type LogEntry = t.TypeOf<typeof logEntryFromIngressLog>;

const logsFromJson = t.array(logEntryFromIngressLog);

export type Logs = t.TypeOf<typeof logsFromJson>;

const earlierDate = (accum: Date, logEntry: LogEntry) => (
  accum < logEntry.time_local ? accum : logEntry.time_local
);

const laterDate = (accum: Date, logEntry: LogEntry) => (
  accum < logEntry.time_local ? logEntry.time_local : accum
);

const toReport = (logs: Logs) => ({
  logEntriesCount: logs.length,
  logStartTime: RA.reduce(new Date('2970-01-01'), earlierDate)(logs),
  logEndTime: RA.reduce(new Date('1970-01-01'), laterDate)(logs),
  logEntries: logs,
});

export type LogFile = {
  logEntriesCount: number,
  logStartTime: Date,
  logEndTime: Date,
  logEntries: Logs,
};

const parseFile = flow(
  Json.parse,
  E.chainW(logsFromJson.decode),
  E.bimap(
    (e) => e as Error,
    toReport,
  ),
);

const convertToValidJson = flow(
  (input: string) => input.split('\n'),
  RA.filter((line) => line.startsWith('{')),
  (lines) => lines.join(','),
  (entries) => `[${entries}]`,
);

export const read = (filename: string): TE.TaskEither<string, LogFile> => pipe(
  filename,
  TE.taskify(fs.readFile),
  TE.map((buffer) => buffer.toString()),
  TE.map(convertToValidJson),
  TE.chainEitherKW(parseFile),
  TE.mapLeft((e) => e.toString()),
);
