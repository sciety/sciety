import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { SelectAllListsContainingArticle } from '../../../shared-ports/select-all-lists-containing-article';
import { Doi } from '../../../types/doi';
import { ListOwnerId } from '../../../types/list-owner-id';

const getListOwnerName = (ownerId: ListOwnerId) => {
  switch (ownerId.tag) {
    case 'group-id':
      return 'Hardcoded list owner name';
    case 'user-id':
      return 'Hardcoded list owner name';
  }
};

// ts-unused-exports:disable-next-line
export type Ports = {
  selectAllListsContainingArticle: SelectAllListsContainingArticle,
};

export const constructListedIn = (ports: Ports) => (articleId: Doi) => pipe(
  articleId,
  ports.selectAllListsContainingArticle,
  RA.map((list) => ({
    listId: list.id,
    listName: list.name,
    listOwnerName: getListOwnerName(list.ownerId),
  })),
);
