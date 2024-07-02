import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { List } from '../../../../read-models/lists';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { ConstructViewModel } from '../../construct-view-model';
import { constructListCardViewModelWithCurator } from '../../shared-components/list-card';
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

export type Dependencies = DependenciesForViews;

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  dependencies.getNonEmptyUserLists(),
  sortByDefaultListOrdering,
  paginate(20, params.page),
  E.map((pageOfItems) => ({
    listCards: constructListCards(pageOfItems, dependencies),
    pagination: constructDefaultPaginationControls('/lists', pageOfItems),
  })),
  TE.fromEither,
);
