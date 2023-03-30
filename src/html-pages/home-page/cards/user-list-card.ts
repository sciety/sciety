import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { renderUserListCard } from './render-user-list-card';
import { DomainEvent } from '../../../domain-events';
import { LookupList, LookupUser, SelectAllListsOwnedBy } from '../../../shared-ports';
import { HtmlFragment } from '../../../types/html-fragment';
import { userIdCodec } from '../../../types/user-id';
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
) => ({ listId }: { listId: ListId }): O.Option<HtmlFragment> => pipe(
  listId,
  ports.lookupList,
  O.chain((list) => pipe(
    {
      list: O.some(list),
      listOwner: pipe(
        list.ownerId.value,
        userIdCodec.decode,
        O.fromEither,
        O.chain(ports.lookupUser),
      ),
    },
    sequenceS(O.Apply),
  )),
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
