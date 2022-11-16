import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { getUserListDetails } from './get-user-list-details';
import { DomainEvent } from '../../domain-events';
import { renderListCard } from '../../shared-components/list-card/render-list-card';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { UserId } from '../../types/user-id';
import { defaultUserListDescription } from '../static-messages';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const userListCard = (
  getAllEvents: GetAllEvents,
) => (handle: string, userId: UserId, listId: ListId): T.Task<HtmlFragment> => pipe(
  getAllEvents,
  T.map(flow(
    getUserListDetails(userId, listId),
    (listDetails) => ({
      ...listDetails,
      href: `/users/${handle}/lists/saved-articles`,
      title: 'Saved articles',
      description: defaultUserListDescription(`@${handle}`),
      articleCountLabel: 'This list contains',
    }),
    renderListCard,
  )),
);
