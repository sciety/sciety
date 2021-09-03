import * as fs from 'fs';
import * as E from 'fp-ts/Either';
import * as Json from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';

type LogEntry = {
  http_user_agent: string,
  request: string,
  remote_addr: string,
  time_local: string,
};

const toVisits = (logs: Json.Json) => pipe(
  logs as ReadonlyArray<LogEntry>,
  RA.filter((log) => !log.http_user_agent.match(/bot|spider|crawler|dataminr|ltx71/i)),
  RA.filter((log) => !log.request.match(/^GET \/static/)),
);

const parseFile = flow(
  Json.parse,
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
