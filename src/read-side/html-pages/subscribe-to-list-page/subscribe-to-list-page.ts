import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { renderAsHtml } from './render-as-html';
import { DependenciesForViews } from '../../dependencies-for-views';
import { constructErrorPageViewModel } from '../construct-error-page-view-model';
import { ConstructPage } from '../construct-page';

export const subscribeToListPage = (dependencies: DependenciesForViews): ConstructPage => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(constructErrorPageViewModel, renderAsHtml),
);
