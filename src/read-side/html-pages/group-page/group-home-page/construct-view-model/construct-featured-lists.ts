import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { List } from '../../../../../read-models/lists';
import { constructListCardViewModelWithCurator } from '../../../../../shared-components/list-card';
import { GroupId } from '../../../../../types/group-id';
import { ViewModel } from '../view-model';

const constructAFeaturedListsCard = (dependencies: Dependencies) => (list: List) => pipe(
  list,
  constructListCardViewModelWithCurator(dependencies),
  (viewModel) => ({
    ...viewModel,
    imageUrl: dependencies.lookupHardcodedListImage(list.id),
  }),
);

export const constructFeaturedLists = (
  dependencies: Dependencies,
  groupId: GroupId,
): ViewModel['featuredLists'] => pipe(
  groupId,
  dependencies.selectAllListsPromotedByGroup,
  RA.map(constructAFeaturedListsCard(dependencies)),
);
