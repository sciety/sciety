import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../../read-models';
import { List } from '../../../read-models/lists';
import { constructListCardViewModelWithCurator, ConstructListCardViewModelWithCuratorDependencies } from '../../../shared-components/list-card';
import * as DE from '../../../types/data-error';
import {
  PageOfItems,
  paginate,
  constructDefaultPaginationControls,
} from '../../shared-components/pagination';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { Params } from '../params';
import { ViewModel } from '../view-model';

const constructListCards = (pageOfItems: PageOfItems<List>, dependencies: Dependencies) => pipe(
  pageOfItems.items,
  RA.map(constructListCardViewModelWithCurator(dependencies)),
);

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
    pagination: constructDefaultPaginationControls('/lists', pageOfItems),
  })),
);
