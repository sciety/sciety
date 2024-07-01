import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Params } from './params';
import * as DE from '../../../../../types/data-error';
import { Group } from '../../../../../types/group';
import { ConstructViewModel } from '../../../construct-view-model';
import { ViewModel } from '../view-model';

const constructHeaderViewModel = (group: Group) => ({
  title: `About ${group.name}`,
  group,
});

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  E.fromOption(() => DE.notFound),
  E.map((group) => ({
    group,
    header: constructHeaderViewModel(group),
  })),
  TE.fromEither,
  TE.chain((partial) => pipe(
    dependencies.fetchStaticFile(`groups/${partial.group.descriptionPath}`),
    TE.map((markdown) => ({
      header: partial.header,
      markdown,
    })),
  )),
);
