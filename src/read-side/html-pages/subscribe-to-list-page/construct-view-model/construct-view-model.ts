import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as DE from '../../../../types/data-error';
import { listIdCodec } from '../../../../types/list-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { decodePageParams } from '../../decode-page-params';
import { ViewModel } from '../view-model';

const codec = t.strict({
  listId: listIdCodec,
});

type ConstructViewModel = (dependencies: DependenciesForViews)
=> (params: Record<string, unknown>)
=> TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params,
  decodePageParams(dependencies.logger, codec),
  TE.fromEither,
  TE.chainW(({ listId }) => pipe(
    listId,
    dependencies.lookupList,
    TE.fromOption(() => DE.notFound),
  )),
  TE.map((list) => ({
    listId: list.id,
    listName: list.name,
    listHref: `/lists/${list.id}`,
    pageHeading: `Subscribe to ${list.name}`,
  })),
);
