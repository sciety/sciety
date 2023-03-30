import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { renderUserListCard } from './render-user-list-card';
import { DomainEvent } from '../../../domain-events';
import {LookupList, LookupUser, SelectAllListsOwnedBy} from '../../../shared-ports';
import { HtmlFragment } from '../../../types/html-fragment';
import * as LOID from '../../../types/list-owner-id';
import { UserId } from '../../../types/user-id';
import { ListId } from '../../../types/list-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
  lookupList: LookupList,
  lookupUser: LookupUser,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const userListCard = (
  ports: Ports,
) => ({ userId, listId }: { userId: UserId, listId: ListId }): O.Option<HtmlFragment> => pipe(
  {
    list: ports.lookupList(listId),
    listOwner: ports.lookupUser(userId),
  },
  sequenceS(O.Apply),
  O.map(({ list, listOwner }) => ({
    listId: list.id,
    articleCount: list.articleIds.length,
    lastUpdated: O.some(list.lastUpdated),
    description: list.description,
    handle: listOwner.handle,
    avatarUrl: listOwner.avatarUrl,
  })),
  O.map(renderUserListCard),
);
