import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderUserListCard } from './render-user-list-card';
import { DomainEvent } from '../../../domain-events';
import { GetUser, SelectAllListsOwnedBy } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import { HtmlFragment } from '../../../types/html-fragment';
import * as LOID from '../../../types/list-owner-id';
import { UserId } from '../../../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
  getUser: GetUser,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const userListCard = (
  ports: Ports,
) => (userId: UserId, description: string): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  {
    userDetails: pipe(
      userId,
      ports.getUser,
      TE.fromOption(() => DE.notFound),
    ),
    list: pipe(
      userId,
      LOID.fromUserId,
      ports.selectAllListsOwnedBy,
      RA.head,
      E.fromOption(() => DE.notFound),
      T.of,
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map((details) => ({
    listId: details.list.listId,
    articleCount: details.list.articleIds.length,
    lastUpdated: O.some(details.list.lastUpdated),
    handle: details.userDetails.handle,
    avatarUrl: details.userDetails.avatarUrl,
    description,
  })),
  TE.map(renderUserListCard),
);
