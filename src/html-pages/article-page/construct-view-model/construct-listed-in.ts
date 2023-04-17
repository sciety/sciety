import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { SelectAllListsContainingArticle } from '../../../shared-ports/select-all-lists-containing-article';
import { Doi } from '../../../types/doi';

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
    listOwnerName: 'Hardcoded list owner name',
  })),
);
