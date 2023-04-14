import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { GetNonEmptyUserLists } from '../../../shared-ports';

export type Ports = {
  getNonEmptyUserLists: GetNonEmptyUserLists,
};

export const constructViewModel = (ports: Ports) => pipe(
  ports.getNonEmptyUserLists(),
  RA.map((list) => ({
    listId: list.id,
    articleCount: list.articleIds.length,
    updatedAt: O.some(list.updatedAt),
    title: list.name,
    description: list.description,
    articleCountLabel: 'This list contains',
  })),
);
