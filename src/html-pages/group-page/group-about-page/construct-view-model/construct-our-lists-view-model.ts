import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { List } from '../../../../read-models/lists';
import { Group } from '../../../../types/group';
import * as LOID from '../../../../types/list-owner-id';
import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering';
import { ViewModel } from '../view-model';

const maxLists = 3;

const truncatedView = <T>(lists: ReadonlyArray<T>, groupSlug: string) => (
  {
    lists: RA.takeLeft(maxLists)(lists),
    allListsUrl: O.some(`/groups/${groupSlug}/lists`),
  }
);

type ToOurListsViewModel = (groupSlug: string) => (lists: ReadonlyArray<List>) => ViewModel['ourLists'];

export const toOurListsViewModel: ToOurListsViewModel = (groupSlug) => (lists) => pipe(
  lists,
  sortByDefaultListOrdering,
  RA.map((list) => ({
    listId: list.id,
    articleCount: list.entries.length,
    title: list.name,
    updatedAt: list.updatedAt,
    listHref: `/lists/${list.id}`,
  })),
  (listViewModels) => (listViewModels.length > maxLists
    ? truncatedView(listViewModels, groupSlug)
    : { lists: listViewModels, allListsUrl: O.none }
  ),
);

export const constructOurListsViewModel = (dependencies: Dependencies, group: Group): ViewModel['ourLists'] => pipe(
  group.id,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  toOurListsViewModel(group.slug),
);
