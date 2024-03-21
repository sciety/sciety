import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { constructListCardViewModelWithAvatar, ConstructListCardViewModelWithAvatarDependencies } from '../../../shared-components/list-card';
import { sortByDefaultListOrdering } from '../../sort-by-default-list-ordering';
import { Queries } from '../../../read-models';
import { ViewModel } from '../view-model';
import * as DE from '../../../types/data-error';
import { PageOfItems, paginate } from '../../../shared-components/pagination';
import { List } from '../../../read-models/lists';

const constructListCards = (pageOfItems: PageOfItems<List>, dependencies: Dependencies) => pipe(
  pageOfItems.items,
  RA.map(constructListCardViewModelWithAvatar(dependencies)),
);

const constructPagination = () => ({
  backwardPageHref: O.none,
  forwardPageHref: O.none,
  page: 1,
  pageCount: 1,
});

export type Dependencies = Queries & ConstructListCardViewModelWithAvatarDependencies;

export const constructViewModel = (dependencies: Dependencies): E.Either<DE.DataError, ViewModel> => pipe(
  dependencies.getNonEmptyUserLists(),
  sortByDefaultListOrdering,
  paginate(1000, 1),
  E.map((pageOfItems) => ({
    listCards: constructListCards(pageOfItems, dependencies),
    pagination: constructPagination(),
  })),
);
