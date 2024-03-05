import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { constructTabsViewModel } from '../../common-components/tabs-view-model';
import { Dependencies } from './dependencies';
import { constructContent } from './construct-content';
import { Params } from './params';
import * as LID from '../../../../types/list-id';
import { ListCardViewModel, constructListCardViewModelWithAvatar } from '../../../../shared-components/list-card';
import { GroupId } from '../../../../types/group-id';

const constructCollections = (dependencies: Dependencies, groupId: GroupId): O.Option<ListCardViewModel> => {
  if (groupId === '4bbf0c12-629b-4bb8-91d6-974f4df8efb2') {
    return pipe(
      LID.fromValidatedString('454ba80f-e0bc-47ed-ba76-c8f872c303d2'),
      dependencies.lookupList,
      O.map(constructListCardViewModelWithAvatar(dependencies)),
    );
  }
  return O.none;
};

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  O.map((group) => ({
    group,
    isFollowing: pipe(
      params.user,
      O.fold(
        () => false,
        (u) => dependencies.isFollowing(group.id)(u.id),
      ),
    ),
    tabs: constructTabsViewModel(dependencies, group),
  })),
  TE.fromOption(() => DE.notFound),
  TE.chain((partial) => pipe(
    constructContent(dependencies, partial.group, 10, params.page),
    TE.map((content) => ({
      ...partial,
      collections: constructCollections(dependencies, partial.group.id),
      content,
    })),
  )),
);
