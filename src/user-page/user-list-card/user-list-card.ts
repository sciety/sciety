import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { getUserListDetails } from './get-user-list-details';
import { renderUserListCard } from './render-user-list-card';
import { DomainEvent } from '../../domain-events';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const userListCard = (
  getAllEvents: GetAllEvents,
) => (handle: string, userId: UserId): T.Task<HtmlFragment> => pipe(
  getAllEvents,
  T.map(flow(
    getUserListDetails(userId),
    (listDetails) => ({
      ...listDetails,
      handle,
      href: `/users/${handle}/lists/saved-articles`,
      title: 'Saved articles',
    }),
    renderUserListCard,
  )),
);
