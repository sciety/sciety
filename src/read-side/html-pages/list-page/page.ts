import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Params, Dependencies } from './construct-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { HtmlPage } from '../html-page';
import { renderErrorPage } from '../render-error-page';

export const page = (
  dependencies: Dependencies,
) => (
  params: Params,
): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);
