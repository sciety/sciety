import * as crypto from 'crypto';
import * as fs from 'fs';
import * as E from 'fp-ts/Either';
import * as Json from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
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

const logsFromJson = t.array(logEntryFromJson);

type Logs = t.TypeOf<typeof logsFromJson>;

const toVisits = (logs: Logs) => pipe(
  logs,
  RA.filter((log) => log.http_user_agent.length > 0),
  RA.filter((log) => !log.http_user_agent.match(/bot|spider|crawler|ubermetrics|dataminr|ltx71|cloud mapping|python-requests|twingly|dark|expanse/i)),
  RA.filter((log) => !log.request.match(/^HEAD /)),
  RA.filter((log) => !log.request.match(/^GET \/static/)),
  RA.filter((log) => !log.request.match(/^GET \/favicon.ico/)),
  RA.map(({
    http_user_agent, request, remote_addr, time_local,
  }) => ({
    visitorId: crypto.createHash('md5').update(`${remote_addr}${http_user_agent}`).digest('hex'),
    time_local,
    request: request.replace(/ HTTP[^ ]+$/, ''),
  })),
);

const parseFile = flow(
  Json.parse,
  E.chainW(logsFromJson.decode),
  E.map(toVisits),
  E.map((visits) => JSON.stringify(visits, null, 2)),
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  E.getOrElse((e) => { process.stderr.write(`${e}\n`); return ''; }),
);

void (async (): Promise<string> => pipe(
  './reports/2021-09-03.log',
  TE.taskify(fs.readFile),
  TE.map((buffer) => buffer.toString()),
  TE.map(parseFile),
  TE.getOrElse((e) => { process.stderr.write(`${e.toString()}\n`); return T.of(''); }),
  T.map((report) => { process.stdout.write(report); return report; }),
)())();
