import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Group } from '../types/group';
import { GroupRepository } from '../types/group-repository';

export const inMemoryGroupRepository = (
  data: RNEA.ReadonlyNonEmptyArray<Group>,
): GroupRepository => ({
  all: T.of(data),

  lookup: (id) => pipe(
    T.of(data),
    T.map(RA.findFirst((ec) => ec.id === id)),
  ),
});
