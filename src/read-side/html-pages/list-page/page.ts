import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Params, Dependencies } from './construct-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { renderErrorPage } from './render-as-html/render-error-page';
import { HtmlPage } from '../../../html-pages/html-page';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';

export const page = (
  dependencies: Dependencies,
) => (
  params: Params,
): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);