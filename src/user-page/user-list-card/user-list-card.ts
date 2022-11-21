import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { getUserListDetails } from './get-user-list-details';
import { DomainEvent } from '../../domain-events';
import { renderListCard } from '../../shared-components/list-card/render-list-card';
import { List } from '../../shared-ports/select-all-lists-owned-by';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';
import { defaultUserListDescription } from '../static-messages';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const userListCard = (
  getAllEvents: GetAllEvents,
) => (handle: string, userId: UserId, list: List): T.Task<HtmlFragment> => pipe(
  getAllEvents,
  T.map(flow(
    getUserListDetails(userId, list.listId),
    (listDetails) => ({
      ...listDetails,
      articleCount: list.articleIds.length,
      lastUpdated: O.some(list.lastUpdated),
      href: `/users/${handle}/lists/saved-articles`,
      title: 'Saved articles',
      description: defaultUserListDescription(`@${handle}`),
      articleCountLabel: 'This list contains',
    }),
    renderListCard,
  )),
);
