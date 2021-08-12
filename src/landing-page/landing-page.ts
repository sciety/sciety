import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { callsToAction } from './calls-to-action';
import { hero } from './hero';
import { personas } from './personas';
import { recentlyEvaluated } from './recently-evaluated';
import { DomainEvent } from '../domain-events';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { toUserId } from '../types/user-id';
import { userListCard } from './user-list-card';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const userLists = (getAllEvents: GetAllEvents) => pipe(
  {
    prachee: userListCard(getAllEvents)('avasthireading', toUserId('1412019815619911685')),
    kenton: userListCard(getAllEvents)('kenton_swartz', toUserId('1417520401282854918')),
    marius: userListCard(getAllEvents)('behrenstimb', toUserId('1406668195361136640')),
  },
  sequenceS(T.ApplyPar),
);

const renderContent = (userlists: Record<string, HtmlFragment>) => toHtmlFragment(`
  <div class="landing-page">
    ${hero}
    ${recentlyEvaluated(userlists)}
    ${personas}
    ${callsToAction}
  </div>
`);

type Ports = {
  getAllEvents: GetAllEvents,
};

export const landingPage = (ports: Ports): T.Task<Page> => pipe(
  userLists(ports.getAllEvents),
  T.map(renderContent),
  T.map((content) => ({
    title: 'Sciety: the home of public preprint evaluation',
    content,
  })),
);
