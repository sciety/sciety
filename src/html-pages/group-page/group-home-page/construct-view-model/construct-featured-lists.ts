import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ListCardViewModel, constructListCardViewModelWithCurator } from '../../../../shared-components/list-card';
import { GroupId } from '../../../../types/group-id';
import * as LID from '../../../../types/list-id';
import { ViewModel } from '../view-model';

const constructAFeaturedListsCard = (dependencies: Dependencies) => (listId: LID.ListId) => pipe(
  listId,
  dependencies.lookupList,
  O.map(constructListCardViewModelWithCurator(dependencies)),
  O.map((viewModel) => ({
    ...viewModel,
    imageUrl: dependencies.lookupHardcodedListImage(listId),
  })),
);

const filterOutListCardsThatCannotBeDisplayed = (
  listCardViewModels: ReadonlyArray<O.Option<ListCardViewModel>>,
) => pipe(
  listCardViewModels,
  RA.filter(O.isSome),
  RA.map((listCardViewModel) => listCardViewModel.value),
);

export const constructFeaturedLists = (
  dependencies: Dependencies,
  groupId: GroupId,
): ViewModel['featuredLists'] => {
  const featuredListIds = dependencies.selectAllListsFeaturedForGroup(groupId);
  return pipe(
    featuredListIds,
    RA.map(constructAFeaturedListsCard(dependencies)),
    filterOutListCardsThatCannotBeDisplayed,
  );
};
