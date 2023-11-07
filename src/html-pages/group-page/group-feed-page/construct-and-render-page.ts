import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../../../types/html-page';
import { ErrorPageBodyViewModel } from '../../../types/render-page-error';
import { renderAsHtml } from './render-as-html/render-as-html';
import { renderErrorPage } from './render-as-html/render-error-page';
import { constructViewModel, Dependencies, Params } from './construct-view-model';

type GroupPage = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const constructAndRenderPage: GroupPage = (dependencies) => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);
