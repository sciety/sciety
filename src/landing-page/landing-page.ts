import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { callsToAction } from './calls-to-action';
import { hero } from './hero';
import { personas } from './personas';
import { recentlyEvaluated } from './recently-evaluated';
import { userListCard } from './user-list-card';
import { DomainEvent } from '../domain-events';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { toUserId, UserId } from '../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const listCards = (ports: Ports) => pipe(
  {
    prachee: userListCard(ports)(toUserId('1412019815619911685')),
    kenton: userListCard(ports)(toUserId('1417520401282854918')),
    marius: userListCard(ports)(toUserId('1223116442549145601')),
  },
  sequenceS(TE.ApplyPar),
);

const renderContent = (cards: E.Either<DE.DataError, Record<string, HtmlFragment>>) => toHtmlFragment(`
  <div class="landing-page">
    ${hero}
    ${recentlyEvaluated(cards)}
    ${personas}
    ${callsToAction}
  </div>
`);

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, { avatarUrl: string, handle: string }>;

type Ports = {
  getAllEvents: GetAllEvents,
  getUserDetails: GetUserDetails,
};

export const landingPage = (ports: Ports): T.Task<Page> => pipe(
  listCards(ports),
  T.map(renderContent),
  T.map((content) => ({
    title: 'Sciety: the home of public preprint evaluation',
    content,
  })),
);
