import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { LookupList, LookupUser } from '../../../shared-ports';
import { HtmlFragment } from '../../../types/html-fragment';
import { userIdCodec } from '../../../types/user-id';
import { ListId } from '../../../types/list-id';
import { renderListCard } from '../../../shared-components/list-card/render-list-card';

export type Ports = {
  lookupList: LookupList,
  lookupUser: LookupUser,
};

export const userListCard = (
  ports: Ports,
) => (listId: ListId): O.Option<HtmlFragment> => pipe(
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
    updatedAt: O.some(list.updatedAt),
    title: list.name,
    description: list.description,
    avatarUrl: listOwner.avatarUrl,
  })),
  O.map(renderListCard),
);
