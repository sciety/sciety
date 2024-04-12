import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as LOID from '../../../../types/list-owner-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { toOurListsViewModel } from './to-our-lists-view-model';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { Group } from '../../../../types/group';

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

const constructOurListsViewModel = (dependencies: Dependencies, group: Group) => pipe(
  group.id,
  LOID.fromGroupId,
  dependencies.selectAllListsOwnedBy,
  toOurListsViewModel(group.slug),
);

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  TE.fromOption(() => DE.notFound),
  TE.chain((group) => pipe(
    {
      header: TE.right({
        title: `About ${group.name}`,
        group,
      }),
      ourLists: TE.right(constructOurListsViewModel(dependencies, group)),
      markdown: dependencies.fetchStaticFile(`groups/${group.descriptionPath}`),
    },
    sequenceS(TE.ApplyPar),
  )),
);
