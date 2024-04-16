import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Queries } from '../../../read-models';
import * as DE from '../../../types/data-error';
import { listIdCodec } from '../../../types/list-id';
import { ViewModel } from '../view-model';

const codec = t.strict({
  listId: listIdCodec,
});

type ConstructViewModel = (dependencies: Queries) => (params: unknown) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  params,
  codec.decode,
  E.mapLeft(() => DE.notFound),
  TE.fromEither,
  TE.chain(({ listId }) => pipe(
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
