import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as LOID from '../../../../types/list-owner-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { toOurListsViewModel } from './to-our-lists-view-model';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { Group } from '../../../../types/group';

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

const constructHeaderViewModel = (group: Group) => ({
  title: `About ${group.name}`,
  group,
});

const constructOurListsViewModel = (dependencies: Dependencies, group: Group) => pipe(
  group.id,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  toOurListsViewModel(group.slug),
);

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  TE.fromOption(() => DE.notFound),
  TE.map((group) => ({
    group,
    header: constructHeaderViewModel(group),
    ourLists: constructOurListsViewModel(dependencies, group),
  })),
  TE.chain((partial) => pipe(
    dependencies.fetchStaticFile(`groups/${partial.group.descriptionPath}`),
    TE.map((markdown) => ({
      header: partial.header,
      ourLists: partial.ourLists,
      markdown,
    })),
  )),
);
