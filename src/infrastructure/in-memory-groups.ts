import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { GroupRepository } from '../types/group-repository';

export const inMemoryGroupRepository = (
  data: RNEA.ReadonlyNonEmptyArray<Group>,
): GroupRepository => ({
  all: TE.right(data),

  lookup: (id) => pipe(
    T.of(data),
    T.map(RA.findFirst((ec) => ec.id === id)),
  ),

  lookupBySlug: (slug) => pipe(
    T.of(data),
    T.map(RA.findFirst((group) => group.slug === slug)),
    T.map(E.fromOption(() => DE.notFound)),
  ),
});
