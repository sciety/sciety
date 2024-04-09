import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as LOID from '../../../../types/list-owner-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { toOurListsViewModel } from './to-our-lists-view-model';
import { Dependencies } from './dependencies';
import { Params } from './params';

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  TE.fromOption(() => DE.notFound),
  TE.chain((group) => pipe(
    {
      title: TE.right(`About ${group.name}`),
      group: TE.right(group),
      ourLists: pipe(
        group.id,
        LOID.fromGroupId,
        dependencies.selectAllListsOwnedBy,
        toOurListsViewModel(group.slug),
        TE.right,
      ),
      markdown: dependencies.fetchStaticFile(`groups/${group.descriptionPath}`),
    },
    sequenceS(TE.ApplyPar),
  )),
);
