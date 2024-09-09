import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { NonHtmlView } from '../../non-html-view';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

const renderAsJson = (viewModel: Json): NonHtmlViewRepresentation => pipe(
  viewModel,
  JSON.stringify,
  (state) => toNonHtmlViewRepresentation(state, 'application/json'),
);

export const applicationStatus = (dependencies: DependenciesForViews): NonHtmlView => () => pipe(
  constructViewModel(dependencies),
  renderAsJson,
  TE.right,
);
