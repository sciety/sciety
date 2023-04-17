import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { SelectAllListsContainingArticle } from '../../../shared-ports/select-all-lists-containing-article';
import { Doi } from '../../../types/doi';
import { ListOwnerId } from '../../../types/list-owner-id';
import { GetGroup } from '../../../shared-ports';

const getListOwnerName = (ports: Ports) => (ownerId: ListOwnerId) => {
  switch (ownerId.tag) {
    case 'group-id':
      return pipe(
        ownerId.value,
        ports.getGroup,
        O.map((group) => group.name),
        O.getOrElseW(() => { throw new Error(`Failed to get group ${ownerId.value}`); }),
      );

    case 'user-id':
      return 'Hardcoded list owner name';
  }
};

// ts-unused-exports:disable-next-line
export type Ports = {
  selectAllListsContainingArticle: SelectAllListsContainingArticle,
  getGroup: GetGroup,
};

export const constructListedIn = (ports: Ports) => (articleId: Doi) => pipe(
  articleId,
  ports.selectAllListsContainingArticle,
  RA.map((list) => ({
    listId: list.id,
    listName: list.name,
    listOwnerName: getListOwnerName(ports)(list.ownerId),
  })),
);
