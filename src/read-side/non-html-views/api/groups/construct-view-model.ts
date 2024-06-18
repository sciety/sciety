import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { Queries } from '../../../../read-models';

export const constructViewModel = (queries: Queries): ViewModel => ({
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
