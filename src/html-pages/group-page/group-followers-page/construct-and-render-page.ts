import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../../html-page.js';
import { ErrorPageBodyViewModel } from '../../../types/render-page-error.js';
import { renderAsHtml } from './render-as-html/render-as-html.js';
import { renderErrorPage } from './render-as-html/render-error-page.js';
import { constructViewModel, Dependencies, Params } from './construct-view-model/index.js';

type GroupPage = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const constructAndRenderPage: GroupPage = (dependencies) => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);
