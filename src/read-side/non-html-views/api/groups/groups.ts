import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { renderAsJson } from './render-as-json';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { NonHtmlView } from '../../non-html-view';

export const groups = (dependencies: DependenciesForViews): NonHtmlView => () => pipe(
  constructViewModel(dependencies),
  renderAsJson,
  TE.right,
);
