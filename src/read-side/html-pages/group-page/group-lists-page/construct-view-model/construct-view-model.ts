import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructListCards } from './construct-list-cards';
import { Params } from './params';
import * as DE from '../../../../../types/data-error';
import { ConstructViewModel } from '../../../construct-view-model';
import { calculateListCount } from '../../common-components/calculate-list-count';
import { ViewModel } from '../view-model';

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  O.map((group) => pipe(
    {
      header: {
        title: `${group.name} lists`,
        group,
      },
      listCount: pipe(
        group.id,
        calculateListCount(dependencies),
      ),
      listCards: constructListCards(dependencies, group),
    },
  )),
  TE.fromOption(() => DE.notFound),
);
