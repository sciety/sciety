import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as E from 'fp-ts/Either';
import { constructListCardViewModelWithCurator, ConstructListCardViewModelWithCuratorDependencies } from '../../../shared-components/list-card';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { Queries } from '../../../read-models';
import { ViewModel } from '../view-model';
import * as DE from '../../../types/data-error';
import {
  buildPaginationHref,
  PageOfItems,
  paginate,
  PaginationControlsViewModel,
} from '../../shared-components/pagination';
import { List } from '../../../read-models/lists';
import { Params } from '../params';

const constructListCards = (pageOfItems: PageOfItems<List>, dependencies: Dependencies) => pipe(
  pageOfItems.items,
  RA.map(constructListCardViewModelWithCurator(dependencies)),
);

export const constructPagination = (path: string, pageOfItems: PageOfItems<unknown>): PaginationControlsViewModel => ({
  backwardPageHref: buildPaginationHref(path, pageOfItems.prevPage),
  forwardPageHref: buildPaginationHref(path, pageOfItems.nextPage),
  page: pageOfItems.pageNumber,
  pageCount: pageOfItems.numberOfPages,
});

export type Dependencies = Queries & ConstructListCardViewModelWithCuratorDependencies;

export const constructViewModel = (
  dependencies: Dependencies,
) => (
  params: Params,
): E.Either<DE.DataError, ViewModel> => pipe(
  dependencies.getNonEmptyUserLists(),
  sortByDefaultListOrdering,
  paginate(20, params.page),
  E.map((pageOfItems) => ({
    listCards: constructListCards(pageOfItems, dependencies),
    pagination: constructPagination('/lists', pageOfItems),
  })),
);
