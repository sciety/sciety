import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering';
import { ViewModel } from '../view-model';
import { Queries } from '../../../../shared-read-models';
import * as LOID from '../../../../types/list-owner-id';
import { GroupId } from '../../../../types/group-id';

const maxLists = 3;

const truncatedView = <T>(lists: ReadonlyArray<T>, groupSlug: string) => (
  {
    lists: RA.takeLeft(maxLists)(lists),
    allListsUrl: O.some(`/groups/${groupSlug}/lists`),
  }
);

type Dependencies = Pick<Queries, 'selectAllListsOwnedBy'>;

type ToOurListsViewModel = (dependencies: Dependencies, groupId: GroupId, groupSlug: string) => ViewModel['ourLists'];

export const toOurListsViewModel: ToOurListsViewModel = (dependencies, groupId, groupSlug) => pipe(
  groupId,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  sortByDefaultListOrdering,
  RA.map((list) => ({
    listId: list.id,
    articleCount: list.articleIds.length,
    title: list.name,
    updatedAt: list.updatedAt,
  })),
  (listViewModels) => (listViewModels.length > maxLists
    ? truncatedView(listViewModels, groupSlug)
    : { lists: listViewModels, allListsUrl: O.none }
  ),
);
