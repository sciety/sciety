import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Params } from './construct-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { constructErrorPageViewModel, ErrorPageViewModel } from '../../construct-error-page-view-model';
import { HtmlPage } from '../../html-page';

type GroupPage = (dependencies: DependenciesForViews)
=> (params: Params)
=> TE.TaskEither<ErrorPageViewModel, HtmlPage>;

export const constructAndRenderPage: GroupPage = (dependencies) => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(constructErrorPageViewModel, renderAsHtml),
);
