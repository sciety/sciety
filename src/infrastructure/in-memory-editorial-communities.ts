import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { EditorialCommunity } from '../types/editorial-community';
import { eqEditorialCommunityId } from '../types/editorial-community-id';
import { EditorialCommunityRepository } from '../types/editorial-community-repository';

export const inMemoryEditorialCommunityRepository = (
  data: RNEA.ReadonlyNonEmptyArray<EditorialCommunity>,
): EditorialCommunityRepository => ({
  all: T.of(data),

  lookup: (id) => pipe(
    T.of(data),
    T.map(RA.findFirst((ec) => eqEditorialCommunityId.equals(ec.id, id))),
  ),
});
