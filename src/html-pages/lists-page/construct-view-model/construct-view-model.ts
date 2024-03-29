import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { constructListCardViewModelWithCurator, ConstructListCardViewModelWithCuratorDependencies } from '../../../shared-components/list-card';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { Queries } from '../../../read-models';
import { ViewModel } from '../view-model';
import * as DE from '../../../types/data-error';
import { PageOfItems, paginate } from '../../../shared-components/pagination';
import { List } from '../../../read-models/lists';
import { Params } from '../params';

const constructListCards = (pageOfItems: PageOfItems<List>, dependencies: Dependencies) => pipe(
  pageOfItems.items,
  RA.map(constructListCardViewModelWithCurator(dependencies)),
);

const toListsPageHref = O.map((pageNumber: number) => `/lists?page=${pageNumber}`);

const constructPagination = (pageOfItems: PageOfItems<unknown>) => ({
  backwardPageHref: toListsPageHref(pageOfItems.prevPage),
  forwardPageHref: toListsPageHref(pageOfItems.nextPage),
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
    pagination: constructPagination(pageOfItems),
  })),
);
