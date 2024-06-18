import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { renderAsJson } from './render-as-json';
import { Queries } from '../../../../read-models';
import { NonHtmlView } from '../../non-html-view';

export const groups = (queries: Queries): NonHtmlView => () => pipe(
  constructViewModel(queries),
  renderAsJson,
  TE.right,
);
