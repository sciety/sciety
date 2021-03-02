import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { EditorialCommunityRepository } from '../types/editorial-community-repository';
import { Group } from '../types/group';
import { eqGroupId } from '../types/group-id';

export const inMemoryEditorialCommunityRepository = (
  data: RNEA.ReadonlyNonEmptyArray<Group>,
): EditorialCommunityRepository => ({
  all: T.of(data),

  lookup: (id) => pipe(
    T.of(data),
    T.map(RA.findFirst((ec) => eqGroupId.equals(ec.id, id))),
  ),
});
