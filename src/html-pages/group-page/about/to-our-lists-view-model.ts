import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { OurListsViewModel } from './render-our-lists';
import { List } from '../../../types/list';

const maxLists = 3;

const truncatedView = <T>(lists: ReadonlyArray<T>, groupSlug: string) => (
  {
    lists: RA.takeLeft(maxLists)(lists),
    allListsUrl: O.some(`/groups/${groupSlug}/lists`),
  }
);

type ToOurListsViewModel = (groupSlug: string) => (lists: ReadonlyArray<List>) => OurListsViewModel;

export const toOurListsViewModel: ToOurListsViewModel = (groupSlug) => (lists) => pipe(
  lists,
  RA.map((list) => ({
    articleCount: list.articleIds.length,
    href: `/lists/${list.id}`,
    title: list.name,
    lastUpdated: list.lastUpdated,
  })),
  RA.reverse,
  (listViewModels) => (listViewModels.length > maxLists
    ? truncatedView(listViewModels, groupSlug)
    : { lists: listViewModels, allListsUrl: O.none }
  ),
);
