import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructOurListsViewModel } from './construct-our-lists-view-model';
import { Dependencies } from './dependencies';
import { Params } from './params';
import * as DE from '../../../../types/data-error';
import { Group } from '../../../../types/group';
import { ViewModel } from '../view-model';

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

const constructHeaderViewModel = (group: Group) => ({
  title: `About ${group.name}`,
  group,
});

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  E.fromOption(() => DE.notFound),
  E.map((group) => ({
    group,
    header: constructHeaderViewModel(group),
    ourLists: constructOurListsViewModel(dependencies, group),
  })),
  TE.fromEither,
  TE.chain((partial) => pipe(
    dependencies.fetchStaticFile(`groups/${partial.group.descriptionPath}`),
    TE.map((markdown) => ({
      header: partial.header,
      ourLists: partial.ourLists,
      markdown,
    })),
  )),
);
