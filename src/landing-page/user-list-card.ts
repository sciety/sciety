import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderUserListCard } from './render-user-list-card';
import { DomainEvent } from '../domain-events';
import * as DE from '../types/data-error';
import { HtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';
import { getUserListDetails } from '../user-page/user-list-card/get-user-list-details';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, { avatarUrl: string, handle: string }>;

type Ports = {
  getAllEvents: GetAllEvents,
  getUserDetails: GetUserDetails,
};

export const userListCard = (
  ports: Ports,
) => (userId: UserId, description: string): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  {
    userDetails: ports.getUserDetails(userId),
    listDetails: pipe(
      ports.getAllEvents,
      T.map(getUserListDetails(userId)),
      TE.rightTask,
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map((details) => ({
    ...details.listDetails,
    ...details.userDetails,
    description,
  })),
  TE.map(renderUserListCard),
);
