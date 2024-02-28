import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { constructTabsViewModel } from '../../common-components/tabs-view-model';
import { Dependencies } from './dependencies';
import { constructContent } from './construct-content';
import { Params } from './params';
import { rawUserInput } from '../../../../read-models/annotations/handle-event';
import * as LID from '../../../../types/list-id';
import { ListCardViewModel } from '../../../../shared-components/list-card';
import { GroupId } from '../../../../types/group-id';

const conciergedBiophysicsColabUserListCard: ListCardViewModel = {
  listId: LID.fromValidatedString('454ba80f-e0bc-47ed-ba76-c8f872c303d2'),
  articleCount: 706,
  updatedAt: O.some(new Date('2024-02-22')),
  title: 'Reading list',
  description: rawUserInput('Articles that are being read by Biophysics Colab.'),
  avatarUrl: O.some('https://pbs.twimg.com/profile_images/1417582635040317442/jYHfOlh6_normal.jpg'),
};

const constructCollections = (groupId: GroupId): O.Option<ListCardViewModel> => (groupId === '4bbf0c12-629b-4bb8-91d6-974f4df8efb2'
  ? O.some(conciergedBiophysicsColabUserListCard)
  : O.none);

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
      collections: constructCollections(partial.group.id),
      content,
    })),
  )),
);
