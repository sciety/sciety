import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

export const renderAsJson = (viewModel: ViewModel): NonHtmlViewRepresentation => pipe(
  viewModel,
  RA.map((groupStatus) => ({
    ...groupStatus,
    largeLogoPath: pipe(
      groupStatus.largeLogoPath,
      O.getOrElse(() => ''),
    ),
    admins: pipe(
      groupStatus.admins,
      RA.map(O.getOrElseW(() => ({
        error: 'User not found',
      }))),
    ),
  })),
  (groupStatuses) => ({
    groups: groupStatuses,
  }),
  (state) => toNonHtmlViewRepresentation(state, 'application/json'),
);
