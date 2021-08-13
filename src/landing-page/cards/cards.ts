import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { HtmlFragment } from '../../types/html-fragment';
import { toUserId, UserId } from '../../types/user-id';
import { recentlyEvaluated } from '../recently-evaluated';
import { userListCard } from '../user-list-card';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, { avatarUrl: string, handle: string }>;

export type Ports = {
  getAllEvents: GetAllEvents,
  getUserDetails: GetUserDetails,
};

export const cards = (ports: Ports): T.Task<HtmlFragment> => pipe(
  {
    prachee: userListCard(ports)(
      toUserId('1412019815619911685'),
      'See what researchers at Prachee Avasthi’s lab are reading to discover some interesting new work',
    ),
    kenton: userListCard(ports)(
      toUserId('1417520401282854918'),
      'Some interesting preprints on ion channel proteins',
    ),
    marius: userListCard(ports)(
      toUserId('1223116442549145601'),
      'A list of papers on innate immunology curated by Ailís O’Carroll',
    ),
  },
  sequenceS(TE.ApplyPar),
  T.map(recentlyEvaluated),
);
