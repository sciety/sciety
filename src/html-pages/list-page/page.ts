import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../html-page.js';
import { ErrorPageBodyViewModel } from '../../types/render-page-error.js';
import { renderErrorPage } from './render-as-html/render-error-page.js';
import { renderAsHtml } from './render-as-html/render-as-html.js';
import { constructViewModel, Params, Dependencies } from './construct-view-model/index.js';

export const page = (
  dependencies: Dependencies,
) => (
  params: Params,
): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);
