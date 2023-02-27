import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { ContentModel } from '../content-model';
import { ListCardViewModel } from '../../../../shared-components/list-card/render-list-card';
import { List } from '../../../../types/list';
import { ListsTab } from '../view-model';

const toListCardViewModel = (list: List): ListCardViewModel => ({
  ...list,
  listId: list.id,
  title: list.name,
  articleCount: list.articleIds.length,
  articleCountLabel: 'This list contains',
  lastUpdated: O.some(list.lastUpdated),
});

export const constructListsTab = (contentModel: ContentModel): ListsTab => pipe(
  contentModel.lists,
  RA.reverse,
  RA.map(toListCardViewModel),
  (lists) => ({
    selector: 'lists' as const,
    lists,
  }),
);
