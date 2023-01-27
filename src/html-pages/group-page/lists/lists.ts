import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';
import { HtmlFragment } from '../../../types/html-fragment';
import { ContentModel } from '../content-model';
import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { List } from '../../../types/list';

const toListCardViewModel = (list: List): ListCardViewModel => ({
  ...list,
  listId: list.id,
  title: list.name,
  articleCount: list.articleIds.length,
  articleCountLabel: 'This list contains',
  lastUpdated: O.some(list.lastUpdated),
});

export type ListsTabViewModel = {
  lists: ReadonlyArray<ListCardViewModel>,
};

export const constructListsTab = (contentModel: ContentModel): TE.TaskEither<never, ListsTabViewModel> => pipe(
  contentModel.lists,
  RA.reverse,
  RA.map(toListCardViewModel),
  (lists) => ({ lists }),
  TE.right,
);

export const renderListsTab = (viewmodel: ListsTabViewModel): HtmlFragment => (
  renderListOfListCardsWithFallback(viewmodel.lists)
);

export const lists = (contentModel: ContentModel): TE.TaskEither<never, HtmlFragment> => pipe(
  contentModel,
  constructListsTab,
  TE.map(renderListsTab),
);
