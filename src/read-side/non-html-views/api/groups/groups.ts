import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { NonHtmlView } from '../../non-html-view';
import { renderAsJson } from '../render-as-json';

export const groups = (dependencies: DependenciesForViews): NonHtmlView => () => pipe(
  constructViewModel(dependencies),
  renderAsJson,
  TE.right,
);
