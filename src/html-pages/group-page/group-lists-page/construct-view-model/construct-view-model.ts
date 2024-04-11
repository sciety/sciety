import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as LOID from '../../../../types/list-owner-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { constructListCards } from './construct-list-cards';
import { Dependencies } from './dependencies';
import { Params } from './params';

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  O.map((group) => pipe(
    {
      header: {
        title: `${group.name} lists`,
        group,
      },
      listCount: pipe(
        group.id,
        LOID.fromGroupId,
        dependencies.selectAllListsOwnedBy,
        RA.size,
      ),
      listCards: constructListCards(dependencies, group),
    },
  )),
  TE.fromOption(() => DE.notFound),
);
