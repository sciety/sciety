import * as fs from 'fs';
import * as E from 'fp-ts/Either';
import * as Json from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

const logEntryFromJson = t.type({
  http_user_agent: t.string,
  request: t.string,
  remote_addr: t.string,
  time_local: tt.DateFromISOString,
});

type LogEntry = t.TypeOf<typeof logEntryFromJson>;

const logsFromJson = t.array(logEntryFromJson);

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

export const read = (filename: string): TE.TaskEither<string, LogFile> => pipe(
  filename,
  TE.taskify(fs.readFile),
  TE.map((buffer) => buffer.toString()),
  TE.chainEitherKW(parseFile),
  TE.mapLeft((e) => e.toString()),
);
