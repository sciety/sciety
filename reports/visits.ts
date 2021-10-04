import * as crypto from 'crypto';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { isAllowedRequest } from './is-allowed-request';
import * as LF from './log-file';
import { PageView } from './page-view';
import * as Sess from './session';

type ObfuscatedPageView = PageView & {
  visitorId: string,
};

type Visits = Map<string, ReadonlyArray<PageView>>;

const collectPageViewsForVisitor = (accum: Visits, pageView: ObfuscatedPageView): Visits => {
  const pvs = accum.get(pageView.visitorId) ?? [];
  return accum.set(pageView.visitorId, pvs.concat({
    time_local: pageView.time_local,
    request: pageView.request,
  }));
};

const isNotCrawler = (pageViews: ReadonlyArray<PageView>) => pipe(
  pageViews,
  RA.every((v) => !v.request.match(/\/robots.txt$|php|\.env/)),
);

const byDate: Ord.Ord<PageView> = pipe(
  D.Ord,
  Ord.contramap((pageView) => pageView.time_local),
);

const byFirstPageView: Ord.Ord<Sess.Session> = pipe(
  D.Ord,
  Ord.contramap((session) => session.pageViews[0].time_local),
);

const toVisitors = (logs: LF.Logs) => pipe(
  logs,
  RA.filter((log) => log.http_user_agent.length > 0),
  RA.filter((log) => !log.http_user_agent.match(/bot|spider|crawler|ubermetrics|dataminr|ltx71|cloud mapping|python-requests|twingly|dark|expanse/i)),
  RA.filter((log) => !log.request.match(/^HEAD /)),
  RA.filter((log) => !log.request.match(/^GET \/static/)),
  RA.filter((log) => !log.request.match(/^GET \/favicon.ico/)),
  RA.filter(({ request }) => isAllowedRequest(request)),
  RA.map(({
    http_user_agent, request, remote_addr, time_local,
  }) => ({
    visitorId: crypto.createHash('md5').update(`${remote_addr}${http_user_agent}`).digest('hex'),
    time_local,
    request: request.replace(/ HTTP[^ ]+$/, ''),
  })),
  RA.reduce(new Map(), collectPageViewsForVisitor),
  RM.filter(isNotCrawler),
  RM.map(RA.sort(byDate)),
);

const toSessions = (visitors: ReadonlyMap<string, ReadonlyArray<PageView>>): ReadonlyArray<Sess.Session> => pipe(
  visitors,
  RM.toReadonlyArray(S.Ord),
  RA.map(([visitorId, pageViews]) => ({
    visitorId,
    pageViews,
  })),
  RA.chain(Sess.split),
  RA.sort(byFirstPageView),
);

const initiatedBreadcrumb = (pageView: PageView) => (
  pageView.request.startsWith('POST ')
);

const countSessionsInitiatingBreadcrumbs = (sessions: ReadonlyArray<Sess.Session>) => pipe(
  sessions,
  RA.filter((session) => pipe(
    session.pageViews,
    RA.some(initiatedBreadcrumb),
  )),
  RA.size,
);

const countBreadcrumbsInitiated = (sessions: ReadonlyArray<Sess.Session>) => pipe(
  sessions,
  RA.chain((session) => session.pageViews),
  RA.filter(initiatedBreadcrumb),
  RA.size,
);

const toVisitorsReport = (logFile: LF.LogFile) => pipe(
  logFile.logEntries,
  toVisitors,
  (visitors) => ({
    visitorsCount: pipe(visitors, RM.size),
    sessions: pipe(visitors, toSessions),
  }),
  ({ visitorsCount, sessions }) => ({
    periodStart: sessions[0].pageViews[0].time_local,
    periodEnd: sessions.slice(-1)[0].pageViews.slice(-1)[0].time_local,
    uniqueVisitors: visitorsCount,
    sessions: sessions.length,
    sessionsInitiatingBreadcrumbs: countSessionsInitiatingBreadcrumbs(sessions),
    breadcrumbsInitiated: countBreadcrumbsInitiated(sessions),
  }),
  (report) => JSON.stringify(report, null, 2),
);

void (async (): Promise<string> => pipe(
  './reports/ingress-logs.jsonl',
  LF.read,
  TE.map(toVisitorsReport),
  TE.match(
    (e) => { process.stderr.write(`${e}\n`); return ''; },
    (report) => { process.stdout.write(report); return report; },
  ),
)())();
