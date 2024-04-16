import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../../read-models';

export const constructViewModel = (queries: Queries): Json => ({
  groups: pipe(
    queries.getAllGroups(),
    RA.map((group) => ({
      ...group,
      largeLogoPath: pipe(
        group.largeLogoPath,
        O.getOrElse(() => ''),
      ),
    })),
  ),
});
