import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { Queries } from '../../../read-models';
import { NonHtmlView } from '../non-html-view';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../non-html-view-representation';

const renderAsJson = (viewModel: Json): NonHtmlViewRepresentation => toNonHtmlViewRepresentation(viewModel, 'application/json');

export const statusGroups = (queries: Queries): NonHtmlView => () => pipe(
  constructViewModel(queries),
  renderAsJson,
  TE.right,
);
