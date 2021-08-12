import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { callsToAction } from './calls-to-action';
import { hero } from './hero';
import { personas } from './personas';
import { recentlyEvaluated } from './recently-evaluated';
import { DomainEvent } from '../domain-events';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { toUserId } from '../types/user-id';
import { userListCard } from '../user-page/user-list-card';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const userLists = (getAllEvents: GetAllEvents) => userListCard(getAllEvents)('avasthireading', toUserId('1412019815619911685'));

const renderContent = (userlists: string) => toHtmlFragment(`
  <div class="landing-page">
    ${hero}
    ${recentlyEvaluated}
    ${process.env.EXPERIMENT_ENABLED === 'true' ? `
      <div>
        ${userlists}
      </div>
      ` : ''}
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
