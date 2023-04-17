import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { GetNonEmptyUserLists } from '../../../shared-ports';
import { List } from '../../../types/list';
import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';

export type Ports = {
  getNonEmptyUserLists: GetNonEmptyUserLists,
};
const constructListCardViewModel = (list: List): ListCardViewModel => ({
  listId: list.id,
  articleCount: list.articleIds.length,
  updatedAt: O.some(list.updatedAt),
  title: list.name,
  description: list.description,
});

export const constructViewModel = (ports: Ports) => pipe(
  ports.getNonEmptyUserLists(),
  RA.map(constructListCardViewModel),
);
